const express = require("express");

const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    patchEmployee,
    deleteEmployee
} = require("../controllers/employee.controller");

const router = express.Router();

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.patch("/:id", patchEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;