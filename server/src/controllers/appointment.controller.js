const appointmentService = require("../services/appointment.service");

const getAppointments = async (req, res) => {
    const appointments = await appointmentService.getAllAppointments();

    res.json(appointments);
};

const getAppointmentById = async (req, res) => {
    const appointment = await appointmentService.getAppointmentById(
        req.params.id
    );

    res.json(appointment);
};

const createAppointment = async (req, res) => {
    const appointment = await appointmentService.createAppointment(req.body);

    res.status(201).json(appointment);
};

const updateAppointment = async (req, res) => {
    const appointment = await appointmentService.updateAppointment(
        req.params.id,
        req.body
    );

    res.json(appointment);
};

const deleteAppointment = async (req, res) => {
    const appointment = await appointmentService.deleteAppointment(
        req.params.id
    );

    res.json(appointment);
};

module.exports = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};