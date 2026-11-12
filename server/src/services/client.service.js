const clientModel = require("../models/client.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const DuplicateResourceException = require("../../utils/exceptions/duplicate-resource.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");


const validateId = (id) => {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw InvalidDataException("ID-ul clientului este invalid");
    }
};

const validateClient = (client) => {
    if (!client || typeof client !== "object" || Array.isArray(client)) {
        throw InvalidDataException("Datele clientului sunt invalide");
    }

    if (
        typeof client.nume !== "string" || !client.nume.trim() ||
        typeof client.prenume !== "string" || !client.prenume.trim() ||
        typeof client.telefon !== "string" || !client.telefon.trim() ||
        typeof client.email !== "string" || !client.email.trim() ||
        typeof client.parola !== "string" || !client.parola.trim()
    ) {
        throw InvalidDataException("Toate câmpurile clientului sunt obligatorii și trebuie să fie text");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
        throw InvalidDataException("Adresa de email este invalidă");
    }

    if (!/^\+?[0-9\s()-]{7,20}$/.test(client.telefon)) {
        throw InvalidDataException("Numărul de telefon este invalid");
    }
};

const getAllClients = async () => {
    return await clientModel.getAll();
};

const getClientById = async (id) => {
    validateId(id);

    const client = await clientModel.getById(id);

    if (!client) {
        throw ResourceNotFoundException(
            `Clientul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return client;
};

const createClient = async (client) => {
    validateClient(client);

    try {
        return await clientModel.create(client);
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException(
                `Clientul cu email-ul ${client.email} există deja`
            );
        }

        throw error;
    }
};



const updateClient = async (id, client) => {
    validateId(id);
    validateClient(client);

    const updatedClient = await clientModel.update(id, client);

    if (!updatedClient) {
        throw ResourceNotFoundException(
            `Clientul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return updatedClient;
};


const patchClient = async (id, client) => {
    validateId(id);

    if (
        !client ||
        typeof client !== "object" ||
        Array.isArray(client)
    ) {
        throw InvalidDataException("Datele clientului sunt invalide");
    }

    const allowedFields = [
        "nume",
        "prenume",
        "telefon",
        "email",
        "parola"
    ];

    const fields = Object.keys(client);

    if (fields.length === 0) {
        throw InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }

    if (fields.some(field => !allowedFields.includes(field))) {
        throw InvalidDataException(
            "Cererea conține câmpuri care nu pot fi modificate"
        );
    }

    const existingClient = await clientModel.getById(id);

    if (!existingClient) {
        throw ResourceNotFoundException(
            `Clientul cu ID-ul ${id} nu a fost găsit`
        );
    }

    const clientToValidate = {
        ...existingClient,
        ...client
    };

    validateClient(clientToValidate);

    try {
        return await clientModel.patch(id, client);
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException(
                `Clientul cu email-ul ${client.email} există deja`
            );
        }

        throw error;
    }
};


const deleteClient = async (id) => {
    validateId(id);

    const deletedClient = await clientModel.deleteById(id);

    if (!deletedClient) {
        throw ResourceNotFoundException(
            `Clientul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return deletedClient;
};
module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    patchClient,
    deleteClient
};