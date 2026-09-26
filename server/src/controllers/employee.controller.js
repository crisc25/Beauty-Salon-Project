const employeeService = require("../services/employee.service");

const getEmployees = async (req, res) => {
    const employees = await employeeService.getAllEmployees();

    res.json(employees);
};

const getEmployeeById = async (req, res) => {
    const employee = await employeeService.getEmployeeById(req.params.id);

    res.json(employee);
};

const createEmployee = async (req, res) => {
    const employee = await employeeService.createEmployee(req.body);

    res.status(201).json(employee);
};

const updateEmployee = async (req, res) => {
    const employee = await employeeService.updateEmployee(
        req.params.id,
        req.body
    );

    res.json(employee);
};

const deleteEmployee = async (req, res) => {
    const employee = await employeeService.deleteEmployee(req.params.id);

    res.json(employee);
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};