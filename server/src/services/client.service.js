const clientModel = require("../models/client.model");

const getAllClients = async () => {
    return await clientModel.getAll();
};

const getClientById = async (id) => {
    return await clientModel.getById(id);
};


const createClient = async (client) => {
    return await clientModel.create(client);
};


const updateClient = async (id, client) => {
    return await clientModel.update(id, client);
};

const patchClient = async (id, client) => {
    return await clientModel.patch(id, client);
};

const deleteClient = async (id) => {
    return await clientModel.deleteById(id);
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    patchClient,
    deleteClient
};