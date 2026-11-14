
const express = require("express");

const {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    patchAppointment,
    checkEmployeeAvailability,
    deleteAppointment
} = require("../controllers/appointment.controller");

const authenticateAdmin = require("../middlewares/auth.middlewares");

const router = express.Router();

// Rute publice – nu necesită autentificare
router.get("/", getAppointments);
router.get("/angajat/:id_angajat/disponibilitate", checkEmployeeAvailability);
router.get("/:id", getAppointmentById);


// Rute protejate – necesită token JWT de administrator
router.post("/", authenticateAdmin, createAppointment);
router.put("/:id", authenticateAdmin, updateAppointment);
router.patch("/:id", authenticateAdmin, patchAppointment);
router.delete("/:id", authenticateAdmin, deleteAppointment);

module.exports = router;
