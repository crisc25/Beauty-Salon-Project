const pool = require("../../config/db");

const getAll = async () => {
    const result = await pool.query(`
        SELECT *
        FROM categorii
        ORDER BY id_categorie
    `);

    return result.rows;
};
const getById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM categorii WHERE id_categorie = $1",
        [id]
    );

    return result.rows[0];
};

const create = async (category) => {
    const result = await pool.query(
        `INSERT INTO categorii
        (nume_categorie, descriere)
        VALUES ($1, $2)
        RETURNING *`,
        [
            category.nume_categorie,
            category.descriere
        ]
    );

    return result.rows[0];
};

const update = async (id, category) => {
    const result = await pool.query(
        `UPDATE categorii
         SET nume_categorie = $1,
             descriere = $2
         WHERE id_categorie = $3
         RETURNING *`,
        [
            category.nume_categorie,
            category.descriere,
            id
        ]
    );

    return result.rows[0];
};
const deleteById = async (id) => {
    const result = await pool.query(
        "DELETE FROM categorii WHERE id_categorie = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};
module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
};