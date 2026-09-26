const employeeServiceService = require("../services/employeeService.service");

const getEmployeeServices = async (req, res) => {
    const employeeServices =
        await employeeServiceService.getAllEmployeeServices();

    res.json(employeeServices);
};

const getEmployeeServicesByEmployee = async (req, res) => {
    const employeeServices =
        await employeeServiceService.getEmployeeServicesByEmployee(
            req.params.id_angajat
        );

    res.json(employeeServices);
};

const addEmployeeService = async (req, res) => {
    const employeeService =
        await employeeServiceService.addEmployeeService(
            req.body.id_angajat,
            req.body.id_serviciu
        );

    res.status(201).json(employeeService);
};

const deleteEmployeeService = async (req, res) => {
    const employeeService =
        await employeeServiceService.deleteEmployeeService(
            req.params.id_angajat,
            req.params.id_serviciu
        );

    res.json(employeeService);
};

module.exports = {
    getEmployeeServices,
    getEmployeeServicesByEmployee,
    addEmployeeService,
    deleteEmployeeService
};