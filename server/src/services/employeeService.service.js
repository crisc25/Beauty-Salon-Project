const employeeServiceModel = require("../models/employeeService.model");
const DuplicateResourceException = require("../../utils/exceptions/duplicate-resource.exception");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");

const getAllEmployeeServices = async () => {
    return await employeeServiceModel.getAll();
};

const getEmployeeServicesByEmployee = async (id_angajat) => {
    return await employeeServiceModel.getByEmployee(id_angajat);
};

const addEmployeeService = async (id_angajat, id_serviciu) => {
    try {
        return await employeeServiceModel.add(id_angajat, id_serviciu);
    } catch (error) {
        if (error.code === "23505") {
            throw  DuplicateResourceException(
                "Această asociere angajat-serviciu există deja"
            );
        }

        if (error.code === "23503") {
            throw  ResourceNotFoundException(
                "Angajatul sau serviciul specificat nu există"
            );
        }

        throw error;
    }
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