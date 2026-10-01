const serviceModel = require("../models/service.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");


const getAllServices = async () => {
    return await serviceModel.getAll();
};


const getServiceById = async (id) => {
    const service = await serviceModel.getById(id);

    if (!service) {
        throw new ResourceNotFoundException(
            `Serviciul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return service;
};


const createService = async (service) => {
    return await serviceModel.create(service);
};





const updateService = async (id, service) => {
    const updatedService = await serviceModel.update(id, service);

    if (!updatedService) {
        throw new ResourceNotFoundException(
            `Serviciul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return updatedService;
};

const patchService = async (id, service) => {
    const patchedService = await serviceModel.patch(id, service);

    if (patchedService === null) {
        throw new InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }
    if (!patchedService) {
        throw new ResourceNotFoundException(
            `Serviciul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return patchedService;
};



const deleteService = async (id) => {
    const deletedService = await serviceModel.deleteById(id);

    if (!deletedService) {
        throw new ResourceNotFoundException(
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