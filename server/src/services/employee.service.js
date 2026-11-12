const employeeModel = require("../models/employee.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");
const DuplicateResourceException = require("../../utils/exceptions/duplicate-resource.exception");


const validateId = (id) => {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw InvalidDataException("ID-ul angajatului este invalid");
    }
};

const validateEmployee = (employee) => {
    if (
        !employee ||
        typeof employee !== "object" ||
        Array.isArray(employee)
    ) {
        throw InvalidDataException("Datele angajatului sunt invalide");
    }

    const requiredFields = [
        "nume",
        "prenume",
        "telefon",
        "specializare",
        "email",
        "parola",
        "rol",
        "data_angajarii"
    ];

    for (const field of requiredFields) {
        if (
            typeof employee[field] !== "string" ||
            !employee[field].trim()
        ) {
            throw InvalidDataException(
                `Câmpul ${field} este obligatoriu și trebuie să fie text`
            );
        }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
        throw InvalidDataException("Adresa de email este invalidă");
    }

    if (!/^\+?[0-9\s()-]{7,20}$/.test(employee.telefon)) {
        throw InvalidDataException("Numărul de telefon este invalid");
    }

    if (!["admin", "angajat"].includes(employee.rol)) {
        throw InvalidDataException("Rolul angajatului este invalid");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(employee.data_angajarii)) {
        throw InvalidDataException(
            "Data angajării trebuie să respecte formatul YYYY-MM-DD"
        );
    }

    const date = new Date(`${employee.data_angajarii}T00:00:00`);

    if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== employee.data_angajarii
    ) {
        throw InvalidDataException("Data angajării este invalidă");
    }
};

const getAllEmployees = async () => {
    return await employeeModel.getAll();
};


const getEmployeeById = async (id) => {
    validateId(id);

    const employee = await employeeModel.getById(id);

    if (!employee) {
        throw ResourceNotFoundException(
            `Angajatul cu ID-ul ${id} nu a fost găsit`
        );
    }

    return employee;
};

const createEmployee = async (employee) => {
    validateEmployee(employee);

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
    validateId(id);
    validateEmployee(employee);

    try {
        const updatedEmployee = await employeeModel.update(id, employee);

        if (!updatedEmployee) {
            throw ResourceNotFoundException(
                `Angajatul cu ID-ul ${id} nu a fost găsit`
            );
        }

        return updatedEmployee;
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException(
                `Emailul ${employee.email} este deja utilizat`
            );
        }

        throw error;
    }
};
const patchEmployee = async (id, employee) => {
    validateId(id);

    if (
        !employee ||
        typeof employee !== "object" ||
        Array.isArray(employee)
    ) {
        throw InvalidDataException("Datele trimise sunt invalide");
    }

    const allowedFields = [
        "nume",
        "prenume",
        "telefon",
        "specializare",
        "email",
        "parola",
        "rol",
        "data_angajarii"
    ];

    const fields = Object.keys(employee);

    if (fields.length === 0) {
        throw InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }

    if (fields.some(field => !allowedFields.includes(field))) {
        throw InvalidDataException(
            "Cererea conține câmpuri care nu pot fi modificate"
        );
    }

    const existingEmployee = await employeeModel.getById(id);

    if (!existingEmployee) {
        throw ResourceNotFoundException(
            `Angajatul cu ID-ul ${id} nu a fost găsit`
        );
    }

    const employeeToValidate = {
        ...existingEmployee,
        ...employee
    };

    validateEmployee(employeeToValidate);

    try {
        return await employeeModel.patch(id, employee);
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
    validateId(id);

    const deletedEmployee = await employeeModel.deleteById(id);

    if (!deletedEmployee) {
        throw ResourceNotFoundException(
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