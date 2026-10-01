const employeeModel = require("../models/employee.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");


const getAllEmployees = async () => {
    return await employeeModel.getAll();
};


const getEmployeeById = async (id) => {
    const employee = await employeeModel.getById(id);

    if (!employee) {
        throw new ResourceNotFoundException(
            `Angajatul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return employee;
};

const createEmployee = async (employee) => {
    return await employeeModel.create(employee);
};

const updateEmployee = async (id, employee) => {
    const updatedEmployee = await employeeModel.update(id, employee);

    if (!updatedEmployee) {
        throw new ResourceNotFoundException(
            `Angajatul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return updatedEmployee;
};


const patchEmployee = async (id, employee) => {
    const patchedEmployee = await employeeModel.patch(id, employee);
    if (patchedEmployee === null) {
        throw new InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }
    if (!patchedEmployee) {
        throw new ResourceNotFoundException(
            `Angajatul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return patchedEmployee;
};



const deleteEmployee = async (id) => {
    const deletedEmployee = await employeeModel.deleteById(id);

    if (!deletedEmployee) {
        throw new ResourceNotFoundException(
            `Angajatul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return deletedEmployee;
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    patchEmployee,
    deleteEmployee
};