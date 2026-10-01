const employeeModel = require("../models/employee.model");
const getAllEmployees = async () => {
    return await employeeModel.getAll();
};

const getEmployeeById = async (id) => {
    return await employeeModel.getById(id);
};


const createEmployee = async (employee) => {
    return await employeeModel.create(employee);
};
const updateEmployee = async (id, employee) => {
    return await employeeModel.update(id, employee);
};

const deleteEmployee = async (id) => {
    return await employeeModel.deleteById(id);
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};