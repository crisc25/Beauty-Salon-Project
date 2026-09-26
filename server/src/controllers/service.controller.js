const serviceService = require("../services/service.service");

const getServices = async (req, res) => {
    const services = await serviceService.getAllServices();

    res.json(services);
};

const getServiceById = async (req, res) => {
    const service = await serviceService.getServiceById(req.params.id);

    res.json(service);
};

const createService = async (req, res) => {
    const service = await serviceService.createService(req.body);

    res.status(201).json(service);
};

const updateService = async (req, res) => {
    const service = await serviceService.updateService(
        req.params.id,
        req.body
    );

    res.json(service);
};

const deleteService = async (req, res) => {
    const service = await serviceService.deleteService(req.params.id);

    res.json(service);
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};