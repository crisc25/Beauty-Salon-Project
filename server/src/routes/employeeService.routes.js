
const express = require("express");

const {
    getEmployeeServices,
    getEmployeeServicesByEmployee,
    addEmployeeService,
    deleteEmployeeService
} = require("../controllers/employeeService.controller");

const authenticateAdmin = require("../middlewares/auth.middlewares");

const router = express.Router();

// Rute publice
router.get("/", getEmployeeServices);
router.get("/angajat/:id_angajat", getEmployeeServicesByEmployee);

// Rute protejate
router.post("/", authenticateAdmin, addEmployeeService);
router.delete("/:id_angajat/:id_serviciu", authenticateAdmin, deleteEmployeeService);

module.exports = router;
