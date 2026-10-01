const appointmentModel = require("../models/appointment.model");

const getAllAppointments = async () => {
    return await appointmentModel.getAll();
};

const getAppointmentById = async (id) => {
    return await appointmentModel.getById(id);
};

const createAppointment = async (appointment) => {
    return await appointmentModel.create(appointment);
};

const updateAppointment = async (id, appointment) => {
    return await appointmentModel.update(id, appointment);
};
const patchAppointment = async (id, appointment) => {
    return await appointmentModel.patch(id, appointment);
};

const deleteAppointment = async (id) => {
    return await appointmentModel.deleteById(id);
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    patchAppointment,
    deleteAppointment
};