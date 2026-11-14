const appointmentService = require("../services/appointment.service");

const getAppointments = async (req, res) => {
    const filters = {
        search: req.query.search,
        status: req.query.status,
        data: req.query.data,
        id_angajat: req.query.id_angajat,
        id_serviciu: req.query.id_serviciu,
        data_start: req.query.data_start,
        data_end: req.query.data_end,

        sortBy: req.query.sortBy,
        direction: req.query.direction,
        page: req.query.page,
        size: req.query.size
    };

    const appointments = await appointmentService.getAllAppointments(filters);

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

const patchAppointment = async (req, res) => {
    const appointment = await appointmentService.patchAppointment(
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
const checkEmployeeAvailability = async (req, res) => {
    const { id_angajat } = req.params;
    const { id_serviciu, data_ora } = req.query;

    const result = await appointmentService.checkEmployeeAvailability(
        id_angajat,
        id_serviciu,
        data_ora
    );

    res.json(result);
};

module.exports = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    patchAppointment,
    checkEmployeeAvailability,
    deleteAppointment
};