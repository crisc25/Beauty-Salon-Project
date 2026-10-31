const appointmentModel = require("../models/appointment.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");

const getAllAppointments = async () => {
    return await appointmentModel.getAll();
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


const validateAppointment = (appointment) => {
    if (
        !appointment ||
        !appointment.id_client ||
        !appointment.id_angajat ||
        !appointment.id_serviciu ||
        !appointment.data_ora
    ) {
        throw InvalidDataException(
            "Clientul, angajatul, serviciul și data programării sunt obligatorii"
        );
    }

    if (
        !Number.isInteger(Number(appointment.id_client)) ||
        Number(appointment.id_client) <= 0 ||
        !Number.isInteger(Number(appointment.id_angajat)) ||
        Number(appointment.id_angajat) <= 0 ||
        !Number.isInteger(Number(appointment.id_serviciu)) ||
        Number(appointment.id_serviciu) <= 0
    ) {
        throw InvalidDataException(
            "ID-urile clientului, angajatului și serviciului trebuie să fie numere întregi pozitive"
        );
    }

    if (Number.isNaN(Date.parse(appointment.data_ora))) {
        throw InvalidDataException(
            "Data și ora programării sunt invalide"
        );
    }
};

const createAppointment = async (appointment) => {
    validateAppointment(appointment);

    return await appointmentModel.create(appointment);
};

const updateAppointment = async (id, appointment) => {
    validateAppointment(appointment);

    const updatedAppointment = await appointmentModel.update(id, appointment);

    if (!updatedAppointment) {
        throw ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    return updatedAppointment;
};


const patchAppointment = async (id, appointment) => {
    if (!appointment || typeof appointment !== "object" || Array.isArray(appointment)) {
        throw InvalidDataException("Datele trimise sunt invalide");
    }

    const allowedFields = [
        "id_client", "id_angajat", "id_serviciu", "data_ora", "status"
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

    const partialAppointment = {
        id_client: appointment.id_client ?? 1,
        id_angajat: appointment.id_angajat ?? 1,
        id_serviciu: appointment.id_serviciu ?? 1,
        data_ora: appointment.data_ora ?? "2000-01-01T00:00:00"
    };

    for (const field of ["id_client", "id_angajat", "id_serviciu"]) {
        if (appointment[field] !== undefined &&
            (!Number.isInteger(Number(appointment[field])) ||
                Number(appointment[field]) <= 0)) {
            throw InvalidDataException(`${field} trebuie să fie un număr întreg pozitiv`);
        }
    }

    if (
        appointment.data_ora !== undefined &&
        Number.isNaN(Date.parse(appointment.data_ora))
    ) {
        throw InvalidDataException("Data și ora programării sunt invalide");
    }

    if (
        appointment.status !== undefined &&
        !["programata", "confirmata", "finalizata", "anulata"].includes(appointment.status)
    ) {
        throw InvalidDataException("Statusul programării este invalid");
    }

    const patchedAppointment = await appointmentModel.patch(id, appointment);

    if (!patchedAppointment) {
        throw ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    return patchedAppointment;
};



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
    deleteAppointment
};