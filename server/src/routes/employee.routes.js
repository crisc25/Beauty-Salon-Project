
const express = require("express");

const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    patchEmployee,
    deleteEmployee
} = require("../controllers/employee.controller");

const authenticateAdmin = require("../middlewares/auth.middlewares");

const router = express.Router();

// Rute publice
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);

// Rute protejate
router.post("/", authenticateAdmin, createEmployee);
router.put("/:id", authenticateAdmin, updateEmployee);
router.patch("/:id", authenticateAdmin, patchEmployee);
router.delete("/:id", authenticateAdmin, deleteEmployee);

module.exports = router;
