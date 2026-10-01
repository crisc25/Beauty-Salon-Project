const employeeServiceModel = require("../models/employeeService.model");

const getAllEmployeeServices = async () => {
    return await employeeServiceModel.getAll();
};

const getEmployeeServicesByEmployee = async (id_angajat) => {
    return await employeeServiceModel.getByEmployee(id_angajat);
};

const addEmployeeService = async (id_angajat, id_serviciu) => {
    return await employeeServiceModel.add(id_angajat, id_serviciu);
};

const deleteEmployeeService = async (id_angajat, id_serviciu) => {
    return await employeeServiceModel.deleteByIds(id_angajat, id_serviciu);
};

module.exports = {
    getAllEmployeeServices,
    getEmployeeServicesByEmployee,
    addEmployeeService,
    deleteEmployeeService
};