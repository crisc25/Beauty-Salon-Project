const express = require("express");

const {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    patchAppointment,
    deleteAppointment
} = require("../controllers/appointment.controller");

const router = express.Router();

router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.patch("/:id", patchAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;