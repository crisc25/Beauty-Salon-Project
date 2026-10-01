const appointmentModel = require("../models/appointment.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");

const getAllAppointments = async () => {
    return await appointmentModel.getAll();
};


const getAppointmentById = async (id) => {
    const appointment = await appointmentModel.getById(id);

    if (!appointment) {
        throw new ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    return appointment;
};
const createAppointment = async (appointment) => {
    return await appointmentModel.create(appointment);
};


const updateAppointment = async (id, appointment) => {
    const updatedAppointment = await appointmentModel.update(id, appointment);

    if (!updatedAppointment) {
        throw new ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    return updatedAppointment;
};


const patchAppointment = async (id, appointment) => {
    const patchedAppointment = await appointmentModel.patch(id, appointment);

    if (patchedAppointment === null) {
        throw new InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }
    if (!patchedAppointment) {
        throw new ResourceNotFoundException(
            `Programarea cu ID-ul ${id} nu a fost găsită`
        );
    }

    return patchedAppointment;
};


const deleteAppointment = async (id) => {
    const deletedAppointment = await appointmentModel.deleteById(id);

    if (!deletedAppointment) {
        throw new ResourceNotFoundException(
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