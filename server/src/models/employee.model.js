const pool = require("../../config/db");

const getAll = async () => {
    const result = await pool.query(`
        SELECT *
        FROM angajati
        ORDER BY id_angajat
    `);

    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM angajati WHERE id_angajat = $1",
        [id]
    );

    return result.rows[0];
};

const create = async (employee) => {
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

const update = async (id, employee) => {
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

const patch = async (id, employee) => {
    const fields = [];
    const values = [];

    if (employee.nume !== undefined) {
        fields.push(`nume = $${values.length + 1}`);
        values.push(employee.nume);
    }

    if (employee.prenume !== undefined) {
        fields.push(`prenume = $${values.length + 1}`);
        values.push(employee.prenume);
    }

    if (employee.telefon !== undefined) {
        fields.push(`telefon = $${values.length + 1}`);
        values.push(employee.telefon);
    }

    if (employee.specializare !== undefined) {
        fields.push(`specializare = $${values.length + 1}`);
        values.push(employee.specializare);
    }

    if (employee.email !== undefined) {
        fields.push(`email = $${values.length + 1}`);
        values.push(employee.email);
    }

    if (employee.parola !== undefined) {
        fields.push(`parola = $${values.length + 1}`);
        values.push(employee.parola);
    }

    if (employee.rol !== undefined) {
        fields.push(`rol = $${values.length + 1}`);
        values.push(employee.rol);
    }

    if (employee.data_angajarii !== undefined) {
        fields.push(`data_angajarii = $${values.length + 1}`);
        values.push(employee.data_angajarii);
    }
    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const result = await pool.query(
        `UPDATE angajati
         SET ${fields.join(", ")}
         WHERE id_angajat = $${values.length}
         RETURNING *`,
        values
    );

    return result.rows[0];
};

const deleteById = async (id) => {
    const result = await pool.query(
        "DELETE FROM angajati WHERE id_angajat = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};
module.exports = {
    getAll,
    getById,
    create,
    update,
    patch,
    deleteById
};