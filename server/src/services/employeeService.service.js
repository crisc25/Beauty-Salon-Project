const employeeServiceModel = require("../models/employeeService.model");
const DuplicateResourceException = require("../../utils/exceptions/duplicate-resource.exception");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");


const validateId = (id, fieldName) => {
    if (
        id === null ||
        id === undefined ||
        id === "" ||
        !Number.isInteger(Number(id)) ||
        Number(id) <= 0
    ) {
        throw InvalidDataException(
            `${fieldName} trebuie să fie un număr întreg pozitiv`
        );
    }
};

const getAllEmployeeServices = async () => {
    return await employeeServiceModel.getAll();
};

const getEmployeeServicesByEmployee = async (id_angajat) => {
    validateId(id_angajat, "ID-ul angajatului");

    return await employeeServiceModel.getByEmployee(id_angajat);
};

const addEmployeeService = async (id_angajat, id_serviciu) => {
    validateId(id_angajat, "ID-ul angajatului");
    validateId(id_serviciu, "ID-ul serviciului");

    try {
        return await employeeServiceModel.add(id_angajat, id_serviciu);
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException(
                "Această asociere angajat-serviciu există deja"
            );
        }

        if (error.code === "23503") {
            throw ResourceNotFoundException(
                "Angajatul sau serviciul specificat nu există"
            );
        }

        throw error;
    }
};

const deleteEmployeeService = async (id_angajat, id_serviciu) => {
    validateId(id_angajat, "ID-ul angajatului");
    validateId(id_serviciu, "ID-ul serviciului");

    const deletedAssociation = await employeeServiceModel.deleteByIds(
        id_angajat,
        id_serviciu
    );

    if (!deletedAssociation) {
        throw ResourceNotFoundException(
            "Asocierea angajat-serviciu nu a fost găsită"
        );
    }

    return deletedAssociation;
};

module.exports = {
    getAllEmployeeServices,
    getEmployeeServicesByEmployee,
    addEmployeeService,
    deleteEmployeeService
};