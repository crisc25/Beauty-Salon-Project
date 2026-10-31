const clientModel = require("../models/client.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const DuplicateResourceException = require("../../utils/exceptions/duplicate-resource.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");


const getAllClients = async () => {
    return await clientModel.getAll();
};

const getClientById = async (id) => {
    const client = await clientModel.getById(id);

    if (!client) {
        throw  ResourceNotFoundException(
            `Clientul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return client;
};


const createClient = async (client) => {
    if (!client.nume || !client.prenume || !client.telefon ||
        !client.email || !client.parola) {
        throw  InvalidDataException(
            "Toate câmpurile clientului sunt obligatorii"
        );
    }

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
    const updatedClient = await clientModel.update(id, client);

    if (!updatedClient) {
        throw  ResourceNotFoundException(
            `Clientul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return updatedClient;
};


const patchClient = async (id, client) => {
    const patchedClient = await clientModel.patch(id, client);

    if (patchedClient === null) {
        throw  InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }

    if (!patchedClient) {
        throw  ResourceNotFoundException(
            `Clientul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return patchedClient;
};



const deleteClient = async (id) => {
    const deletedClient = await clientModel.deleteById(id);

    if (!deletedClient) {
        throw  ResourceNotFoundException(
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