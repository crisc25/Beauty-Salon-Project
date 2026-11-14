
const employeeService = require("../services/employee.service");


const getEmployees = async (req, res) => {
    const filters = {
        search: req.query.search,
        id_serviciu: req.query.id_serviciu,
        sortBy: req.query.sortBy,
        direction: req.query.direction,
        page: req.query.page,
        size: req.query.size
    };

    const employees = await employeeService.getAllEmployees(filters);

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
const patchEmployee = async (req, res) => {
    const employee = await employeeService.patchEmployee(
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
    patchEmployee,
    deleteEmployee
};