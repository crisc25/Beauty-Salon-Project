const employeeModel = require("../models/employee.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");
const DuplicateResourceException = require("../../utils/exceptions/duplicate-resource.exception");


const getAllEmployees = async () => {
    return await employeeModel.getAll();
};


const getEmployeeById = async (id) => {
    const employee = await employeeModel.getById(id);

    if (!employee) {
        throw  ResourceNotFoundException(
            `Angajatul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return employee;
};

const createEmployee = async (employee) => {
    if (
        !employee ||
        !employee.nume ||
        !employee.prenume ||
        !employee.telefon ||
        !employee.specializare ||
        !employee.email ||
        !employee.parola ||
        !employee.rol ||
        !employee.data_angajarii
    ) {
        throw  InvalidDataException(
            "Toate câmpurile angajatului sunt obligatorii"
        );
    }

    try {
        return await employeeModel.create(employee);
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException(
                `Emailul ${employee.email} este deja utilizat`
            );
        }
        throw error;
    }
};

const updateEmployee = async (id, employee) => {
    if (
        !employee ||
        !employee.nume ||
        !employee.prenume ||
        !employee.telefon ||
        !employee.specializare ||
        !employee.email ||
        !employee.parola ||
        !employee.rol ||
        !employee.data_angajarii
    ) {
        throw  InvalidDataException(
            "Toate câmpurile angajatului sunt obligatorii pentru PUT"
        );
    }

    try {
        const updatedEmployee = await employeeModel.update(id, employee);

        if (!updatedEmployee) {
            throw  ResourceNotFoundException(
                `Angajatul cu ID-ul ${id} nu a fost găsit`
            );
        }

        return updatedEmployee;
    } catch (error) {
        if (error.code === "23505") {
            throw  DuplicateResourceException(
                `Emailul ${employee.email} este deja utilizat`
            );
        }
        throw error;
    }
};

const patchEmployee = async (id, employee) => {
    const allowedFields = [
        "nume", "prenume", "telefon", "specializare",
        "email", "parola", "rol", "data_angajarii"
    ];

    if (!employee || typeof employee !== "object" || Array.isArray(employee)) {
        throw  InvalidDataException("Datele trimise sunt invalide");
    }

    const fields = Object.keys(employee);

    if (fields.length === 0) {
        throw  InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }

    if (fields.some(field => !allowedFields.includes(field))) {
        throw  InvalidDataException(
            "Cererea conține câmpuri care nu pot fi modificate"
        );
    }

    if (Object.values(employee).some(value =>
        value === null || value === "" ||
        (typeof value === "string" && !value.trim())
    )) {
        throw InvalidDataException(
            "Valorile câmpurilor nu pot fi goale"
        );
    }

    try {
        const patchedEmployee = await employeeModel.patch(id, employee);

        if (!patchedEmployee) {
            throw  ResourceNotFoundException(
                `Angajatul cu ID-ul ${id} nu a fost găsit`
            );
        }

        return patchedEmployee;
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException(
                `Emailul ${employee.email} este deja utilizat`
            );
        }
        throw error;
    }
};


const deleteEmployee = async (id) => {
    const deletedEmployee = await employeeModel.deleteById(id);

    if (!deletedEmployee) {
        throw  ResourceNotFoundException(
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