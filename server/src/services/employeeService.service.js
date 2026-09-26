const pool = require("../../config/db");

const getAllEmployeeServices = async () => {
    const result = await pool.query(`
        SELECT *
        FROM angajati_servicii
        ORDER BY id_angajat, id_serviciu
    `);

    return result.rows;
};

const getEmployeeServicesByEmployee = async (id_angajat) => {
    const result = await pool.query(
        `SELECT *
         FROM angajati_servicii
         WHERE id_angajat = $1`,
        [id_angajat]
    );

    return result.rows;
};

const addEmployeeService = async (id_angajat, id_serviciu) => {
    const result = await pool.query(
        `INSERT INTO angajati_servicii
        (id_angajat, id_serviciu)
        VALUES ($1, $2)
        RETURNING *`,
        [id_angajat, id_serviciu]
    );

    return result.rows[0];
};

const deleteEmployeeService = async (id_angajat, id_serviciu) => {
    const result = await pool.query(
        `DELETE FROM angajati_servicii
         WHERE id_angajat = $1
         AND id_serviciu = $2
         RETURNING *`,
        [id_angajat, id_serviciu]
    );

    return result.rows[0];
};

module.exports = {
    getAllEmployeeServices,
    getEmployeeServicesByEmployee,
    addEmployeeService,
    deleteEmployeeService
};