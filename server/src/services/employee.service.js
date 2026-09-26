const pool = require("../../config/db");

const getAllEmployees = async () => {
    const result = await pool.query(`
        SELECT *
        FROM angajati
        ORDER BY id_angajat
    `);

    return result.rows;
};

const getEmployeeById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM angajati WHERE id_angajat = $1",
        [id]
    );

    return result.rows[0];
};

const createEmployee = async (employee) => {
    const result = await pool.query(
        `INSERT INTO angajati
        (nume, prenume, telefon, specializare, email, parola, rol, data_angajarii)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            employee.nume,
            employee.prenume,
            employee.telefon,
            employee.specializare,
            employee.email,
            employee.parola,
            employee.rol,
            employee.data_angajarii
        ]
    );

    return result.rows[0];
};

const updateEmployee = async (id, employee) => {
    const result = await pool.query(
        `UPDATE angajati
         SET nume = $1,
             prenume = $2,
             telefon = $3,
             specializare = $4,
             email = $5,
             parola = $6,
             rol = $7,
             data_angajarii = $8
         WHERE id_angajat = $9
         RETURNING *`,
        [
            employee.nume,
            employee.prenume,
            employee.telefon,
            employee.specializare,
            employee.email,
            employee.parola,
            employee.rol,
            employee.data_angajarii,
            id
        ]
    );

    return result.rows[0];
};

const deleteEmployee = async (id) => {
    const result = await pool.query(
        "DELETE FROM angajati WHERE id_angajat = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};