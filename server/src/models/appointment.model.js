const pool = require("../../config/db");

const getAll = async () => {
    const result = await pool.query(`
        SELECT *
        FROM programari
        ORDER BY id_programare
    `);

    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM programari WHERE id_programare = $1",
        [id]
    );

    return result.rows[0];
};
const create = async (appointment) => {
    const result = await pool.query(
        `INSERT INTO programari
        (id_client, id_angajat, id_serviciu, data_ora, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            appointment.id_client,
            appointment.id_angajat,
            appointment.id_serviciu,
            appointment.data_ora,
            appointment.status
        ]
    );

    return result.rows[0];
};
const update = async (id, appointment) => {
    const result = await pool.query(
        `UPDATE programari
         SET id_client = $1,
             id_angajat = $2,
             id_serviciu = $3,
             data_ora = $4,
             status = $5
         WHERE id_programare = $6
         RETURNING *`,
        [
            appointment.id_client,
            appointment.id_angajat,
            appointment.id_serviciu,
            appointment.data_ora,
            appointment.status,
            id
        ]
    );

    return result.rows[0];
};

const patch = async (id, appointment) => {
    const fields = [];
    const values = [];

    if (appointment.id_client !== undefined) {
        fields.push(`id_client = $${values.length + 1}`);
        values.push(appointment.id_client);
    }

    if (appointment.id_angajat !== undefined) {
        fields.push(`id_angajat = $${values.length + 1}`);
        values.push(appointment.id_angajat);
    }

    if (appointment.id_serviciu !== undefined) {
        fields.push(`id_serviciu = $${values.length + 1}`);
        values.push(appointment.id_serviciu);
    }

    if (appointment.data_ora !== undefined) {
        fields.push(`data_ora = $${values.length + 1}`);
        values.push(appointment.data_ora);
    }

    if (appointment.status !== undefined) {
        fields.push(`status = $${values.length + 1}`);
        values.push(appointment.status);
    }

    values.push(id);

    const result = await pool.query(
        `UPDATE programari
         SET ${fields.join(", ")}
         WHERE id_programare = $${values.length}
         RETURNING *`,
        values
    );

    return result.rows[0];
};

const deleteById = async (id) => {
    const result = await pool.query(
        "DELETE FROM programari WHERE id_programare = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};
module.exports={
   getAll,
    getById,
    create,
    update,
    patch,
    deleteById 
}