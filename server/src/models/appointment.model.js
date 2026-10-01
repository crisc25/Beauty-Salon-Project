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
    deleteById 
}