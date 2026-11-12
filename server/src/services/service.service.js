const serviceModel = require("../models/service.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");
const DuplicateResourceException = require("../../utils/exceptions/duplicate-resource.exception");


const validateId = (id) => {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw InvalidDataException("ID-ul serviciului este invalid");
    }
};

const getAllServices = async () => {
    return await serviceModel.getAll();
};


const getServiceById = async (id) => {
    validateId(id);

    const service = await serviceModel.getById(id);

    if (!service) {
        throw ResourceNotFoundException(
            `Serviciul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return service;
};


const createService = async (service) => {
    if (
        !service ||
        !service.id_categorie ||
        !service.denumire ||
        !service.durata_minute ||
        !service.pret ||
        typeof service.is_active !== "boolean"
    ) {
        throw  InvalidDataException(
            "Câmpurile obligatorii ale serviciului sunt invalide sau lipsesc"
        );
    }

    if (
        !Number.isInteger(Number(service.durata_minute)) ||
        Number(service.durata_minute) <= 0 ||
        !Number.isFinite(Number(service.pret)) ||
        Number(service.pret) <= 0
    ) {
        throw  InvalidDataException(
            "Durata și prețul trebuie să fie numere pozitive valide"
        );
    }

    try {
        return await serviceModel.create(service);
    } catch (error) {
        if (error.code === "23505") {
            throw  DuplicateResourceException(
                "Serviciul există deja"
            );
        }
        throw error;
    }
};

const updateService = async (id, service) => {
    validateId(id);

    if (
        !service ||
        typeof service !== "object" ||
        Array.isArray(service)
    ) {
        throw InvalidDataException("Datele serviciului sunt invalide");
    }

    if (
        !service.id_categorie ||
        typeof service.denumire !== "string" ||
        !service.denumire.trim() ||
        !service.durata_minute ||
        !service.pret ||
        typeof service.is_active !== "boolean"
    ) {
        throw InvalidDataException(
            "Toate câmpurile obligatorii ale serviciului trebuie completate"
        );
    }

    if (
        !Number.isInteger(Number(service.id_categorie)) ||
        Number(service.id_categorie) <= 0
    ) {
        throw InvalidDataException("ID-ul categoriei este invalid");
    }

    if (
        !Number.isInteger(Number(service.durata_minute)) ||
        Number(service.durata_minute) <= 0 ||
        !Number.isFinite(Number(service.pret)) ||
        Number(service.pret) <= 0
    ) {
        throw InvalidDataException(
            "Durata și prețul trebuie să fie numere pozitive valide"
        );
    }

    try {
        const updatedService = await serviceModel.update(id, service);

        if (!updatedService) {
            throw ResourceNotFoundException(
                `Serviciul cu ID-ul ${id} nu a fost găsit`
            );
        }

        return updatedService;
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException("Serviciul există deja");
        }
        throw error;
    }
};

const patchService = async (id, service) => {
    validateId(id);

    const allowedFields = [
        "id_categorie",
        "denumire",
        "durata_minute",
        "pret",
        "is_active",
        "descriere"
    ];

    if (!service || typeof service !== "object" || Array.isArray(service)) {
        throw InvalidDataException("Datele trimise sunt invalide");
    }

    const fields = Object.keys(service);

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

    if (fields.some(field =>
        service[field] === null ||
        (typeof service[field] === "string" && !service[field].trim())
    )) {
        throw InvalidDataException("Valorile câmpurilor nu pot fi goale");
    }

    if (
        service.id_categorie !== undefined &&
        (!Number.isInteger(Number(service.id_categorie)) ||
         Number(service.id_categorie) <= 0)
    ) {
        throw InvalidDataException("ID-ul categoriei este invalid");
    }

    if (
        service.denumire !== undefined &&
        typeof service.denumire !== "string"
    ) {
        throw InvalidDataException("Denumirea trebuie să fie text");
    }

    if (
        service.durata_minute !== undefined &&
        (!Number.isInteger(Number(service.durata_minute)) ||
         Number(service.durata_minute) <= 0)
    ) {
        throw InvalidDataException(
            "Durata trebuie să fie un număr întreg pozitiv"
        );
    }

    if (
        service.pret !== undefined &&
        (!Number.isFinite(Number(service.pret)) ||
         Number(service.pret) <= 0)
    ) {
        throw InvalidDataException("Prețul trebuie să fie un număr pozitiv");
    }

    if (
        service.is_active !== undefined &&
        typeof service.is_active !== "boolean"
    ) {
        throw InvalidDataException("is_active trebuie să fie boolean");
    }

    if (
        service.descriere !== undefined &&
        typeof service.descriere !== "string"
    ) {
        throw InvalidDataException("Descrierea trebuie să fie text");
    }

    try {
        const patchedService = await serviceModel.patch(id, service);

        if (!patchedService) {
            throw ResourceNotFoundException(
                `Serviciul cu ID-ul ${id} nu a fost găsit`
            );
        }

        return patchedService;
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException("Serviciul există deja");
        }

        throw error;
    }
};

const deleteService = async (id) => {
    validateId(id);

    const deletedService = await serviceModel.deleteById(id);

    if (!deletedService) {
        throw ResourceNotFoundException(
            `Serviciul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return deletedService;
};
module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    patchService,
    deleteService
}