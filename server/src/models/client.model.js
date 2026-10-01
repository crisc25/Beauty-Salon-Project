const pool = require("../../config/db");

const getAll = async () => {
    const result = await pool.query(`
        SELECT *
        FROM clienti
        ORDER BY id_client
    `);

    return result.rows;
};
const getById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM clienti WHERE id_client = $1",
        [id]
    );

    return result.rows[0];
};

const create = async (client) => {
    const result = await pool.query(
        `INSERT INTO clienti
        (nume, prenume, telefon, email, parola)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            client.nume,
            client.prenume,
            client.telefon,
            client.email,
            client.parola
        ]
    );

    return result.rows[0];
};

const update = async (id, client) => {
    const result = await pool.query(
        `UPDATE clienti
         SET nume = $1,
             prenume = $2,
             telefon = $3,
             email = $4,
             parola = $5
         WHERE id_client = $6
         RETURNING *`,
        [
            client.nume,
            client.prenume,
            client.telefon,
            client.email,
            client.parola,
            id
        ]
    );

    return result.rows[0];
};

const deleteById = async (id) => {
    const result = await pool.query(
        "DELETE FROM clienti WHERE id_client = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};
module.exports ={
    getAll,
    getById,
    create,
    update,
    deleteById
}