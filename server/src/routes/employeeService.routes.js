const express = require("express");

const {
    getEmployeeServices,
    getEmployeeServicesByEmployee,
    addEmployeeService,
    deleteEmployeeService
} = require("../controllers/employeeService.controller");

const router = express.Router();

router.get("/", getEmployeeServices);
router.get("/angajat/:id_angajat", getEmployeeServicesByEmployee);
router.post("/", addEmployeeService);
router.delete("/:id_angajat/:id_serviciu", deleteEmployeeService);

module.exports = router;