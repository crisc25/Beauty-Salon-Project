const clientService = require("../services/client.service");

const getClients = async (req, res) => {
    const clients = await clientService.getAllClients();

    res.json(clients);
};

const getClientById = async (req, res) => {
    const client = await clientService.getClientById(req.params.id);

    res.json(client);
};

const createClient = async (req, res) => {
    const client = await clientService.createClient(req.body);

    res.status(201).json(client);
};

const updateClient = async (req, res) => {
    const client = await clientService.updateClient(
        req.params.id,
        req.body
    );

    res.json(client);
};

const deleteClient = async (req, res) => {
    const client = await clientService.deleteClient(req.params.id);

    res.json(client);
};

module.exports = {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};