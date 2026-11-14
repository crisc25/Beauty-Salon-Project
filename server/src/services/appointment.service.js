
const appointmentModel = require("../models/appointment.model");
const clientModel = require("../models/client.model");
const employeeModel = require("../models/employee.model");
const serviceModel = require("../models/service.model");
const employeeServiceModel = require("../models/employeeService.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");

const getAllAppointments = async (filters) => {
    return await appointmentModel.getAll(filters);
};

const getAppointmentById = async (id) => {
    const appointment = await appointmentModel.getById(id);

    if (!appointment) {
        throw ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    return appointment;
};

// Verifică dacă un ID este un număr întreg pozitiv
const validateId = (value, fieldName) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        !Number.isInteger(Number(value)) ||
        Number(value) <= 0
    ) {
        throw InvalidDataException(
            `${fieldName} trebuie să fie un număr întreg pozitiv`
        );
    }
};

// Verifică formatul și validitatea datei și orei

const validateDateTime = (value) => {
    const match = typeof value === "string"
        ? value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/)
        : null;

    if (!match) {
        throw InvalidDataException(
            "Data și ora trebuie să respecte formatul YYYY-MM-DDTHH:mm:ss"
        );
    }

    const [, year, month, day, hour, minute, second = "00"] = match;

    const date = new Date(Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    ));

    if (
        date.getUTCFullYear() !== Number(year) ||
        date.getUTCMonth() !== Number(month) - 1 ||
        date.getUTCDate() !== Number(day) ||
        date.getUTCHours() !== Number(hour) ||
        date.getUTCMinutes() !== Number(minute) ||
        date.getUTCSeconds() !== Number(second)
    ) {
        throw InvalidDataException(
            "Data și ora programării sunt invalide"
        );
    }
};


// Validare completă pentru POST și PUT
const validateAppointment = (appointment) => {
    if (
        !appointment ||
        typeof appointment !== "object" ||
        Array.isArray(appointment)
    ) {
        throw InvalidDataException("Datele programării sunt invalide");
    }

    const requiredFields = [
        "id_client",
        "id_angajat",
        "id_serviciu",
        "data_ora"
    ];

    for (const field of requiredFields) {
        if (
            appointment[field] === undefined ||
            appointment[field] === null ||
            appointment[field] === ""
        ) {
            throw InvalidDataException(
                `Câmpul ${field} este obligatoriu`
            );
        }
    }

    validateId(appointment.id_client, "ID-ul clientului");
    validateId(appointment.id_angajat, "ID-ul angajatului");
    validateId(appointment.id_serviciu, "ID-ul serviciului");
    validateDateTime(appointment.data_ora);
};

const validateAppointmentRelations = async (appointment) => {
    const client = await clientModel.getById(appointment.id_client);

    if (!client) {
        throw InvalidDataException("Clientul selectat nu există");
    }

    const employee = await employeeModel.getById(appointment.id_angajat);

    if (!employee) {
        throw InvalidDataException("Angajatul selectat nu există");
    }

    const service = await serviceModel.getById(appointment.id_serviciu);

    if (!service) {
        throw InvalidDataException("Serviciul selectat nu există");
    }

    if (service.is_active !== true) {
        throw InvalidDataException(
            "Serviciul selectat nu este activ și nu poate fi programat"
        );
    }

    const isAssigned = await employeeServiceModel.exists(
        appointment.id_angajat,
        appointment.id_serviciu
    );

    if (!isAssigned) {
        throw InvalidDataException(
            "Angajatul selectat nu prestează serviciul ales"
        );
    }
};


const checkEmployeeAvailability = async (id_angajat, id_serviciu, data_ora) => {
    validateId(id_angajat, "ID-ul angajatului");
    validateId(id_serviciu, "ID-ul serviciului");
    validateDateTime(data_ora);

    const employee = await employeeModel.getById(id_angajat);

    if (!employee) {
        throw ResourceNotFoundException("Angajatul nu există");
    }

    const service = await serviceModel.getById(id_serviciu);

    if (!service) {
        throw ResourceNotFoundException("Serviciul nu există");
    }

    if (service.is_active !== true) {
        throw InvalidDataException("Serviciul nu este activ");
    }

    const isAssigned = await employeeServiceModel.exists(
        id_angajat,
        id_serviciu
    );

    if (!isAssigned) {
        throw InvalidDataException(
            "Angajatul nu prestează serviciul ales"
        );
    }

    const isOccupied = await appointmentModel.hasOverlappingAppointment(
        id_angajat,
        data_ora,
        service.durata_minute
    );

    return {
        disponibil: !isOccupied,
        mesaj: isOccupied
            ? "Angajatul are deja o programare în acest interval"
            : "Angajatul este disponibil pentru intervalul solicitat"
    };
};

// Crearea unei programări
const createAppointment = async (appointment) => {
    validateAppointment(appointment);

    await validateAppointmentRelations(appointment);

    return await appointmentModel.create(appointment);
};

// Actualizarea completă a unei programări
const updateAppointment = async (id, appointment) => {
    validateId(id, "ID-ul programării");
    validateAppointment(appointment);

    await validateAppointmentRelations(appointment);

    const updatedAppointment = await appointmentModel.update(
        id,
        appointment
    );

    if (!updatedAppointment) {
        throw ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    return updatedAppointment;
};

// Actualizarea parțială a unei programări

const patchAppointment = async (id, appointment) => {
    validateId(id, "ID-ul programării");

    if (
        !appointment ||
        typeof appointment !== "object" ||
        Array.isArray(appointment)
    ) {
        throw InvalidDataException("Datele trimise sunt invalide");
    }

    const allowedFields = [
        "id_client",
        "id_angajat",
        "id_serviciu",
        "data_ora",
        "status"
    ];

    const fields = Object.keys(appointment);

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

    if (appointment.id_client !== undefined) {
        validateId(appointment.id_client, "ID-ul clientului");
    }

    if (appointment.id_angajat !== undefined) {
        validateId(appointment.id_angajat, "ID-ul angajatului");
    }

    if (appointment.id_serviciu !== undefined) {
        validateId(appointment.id_serviciu, "ID-ul serviciului");
    }

    if (appointment.data_ora !== undefined) {
        validateDateTime(appointment.data_ora);
    }

    if (
        appointment.status !== undefined &&
        !["programata", "confirmata", "finalizata", "anulata"]
            .includes(appointment.status)
    ) {
        throw InvalidDataException("Statusul programării este invalid");
    }

    // Verificăm dacă programarea există
    const existingAppointment = await appointmentModel.getById(id);

    if (!existingAppointment) {
        throw ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    // Verificăm dacă schimbarea statusului este permisă
    if (appointment.status !== undefined) {
        const allowedTransitions = {
            programata: ["confirmata", "anulata"],
            confirmata: ["finalizata", "anulata"],
            finalizata: [],
            anulata: []
        };

        const currentStatus = existingAppointment.status;
        const newStatus = appointment.status;

        if (!allowedTransitions[currentStatus].includes(newStatus)) {
            throw InvalidDataException(
                `Nu este permisă schimbarea statusului din "${currentStatus}" în "${newStatus}"`
            );
        }
    }

    // Completăm câmpurile nemodificate cu valorile existente
    const appointmentToValidate = {
        id_client: appointment.id_client ?? existingAppointment.id_client,
        id_angajat: appointment.id_angajat ?? existingAppointment.id_angajat,
        id_serviciu: appointment.id_serviciu ?? existingAppointment.id_serviciu
    };

    // Verificăm existența clientului, angajatului și serviciului
    await validateAppointmentRelations(appointmentToValidate);

    const patchedAppointment = await appointmentModel.patch(
        id,
        appointment
    );

    return patchedAppointment;
};

// Ștergerea unei programări
const deleteAppointment = async (id) => {
    const deletedAppointment = await appointmentModel.deleteById(id);

    if (!deletedAppointment) {
        throw ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    return deletedAppointment;
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    patchAppointment,
    checkEmployeeAvailability,
    deleteAppointment
};
