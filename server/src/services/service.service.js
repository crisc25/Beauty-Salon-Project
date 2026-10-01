const serviceModel = require("../models/service.model");

const getAllServices = async () => {
    return await serviceModel.getAll();
};

const getServiceById = async (id) => {
    return await serviceModel.getById(id);
};


const createService = async (service) => {
    return await serviceModel.create(service);
};



const updateService = async (id, service) => {
    return await serviceModel.update(id, service);
};

const patchService = async (id, service) => {
    return await serviceModel.patch(id, service);
};


const deleteService = async (id) => {
    return await serviceModel.deleteById(id);
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    patchService,
    deleteService
}