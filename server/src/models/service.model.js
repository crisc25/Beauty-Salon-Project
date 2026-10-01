const pool = require("../../config/db");

const getAll = async () => {
    const result = await pool.query(`
        SELECT *
        FROM servicii
        ORDER BY id_serviciu
    `);

    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM servicii WHERE id_serviciu = $1",
        [id]
    );

    return result.rows[0];
};

const create = async (service) => {
    const result = await pool.query(
        `INSERT INTO servicii
        (id_categorie, denumire, durata_minute, pret, is_active, descriere)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            service.id_categorie,
            service.denumire,
            service.durata_minute,
            service.pret,
            service.is_active,
            service.descriere
        ]
    );

    return result.rows[0];
};

const update = async (id, service) => {
    const result = await pool.query(
        `UPDATE servicii
         SET id_categorie = $1,
             denumire = $2,
             durata_minute = $3,
             pret = $4,
             is_active = $5,
             descriere = $6
         WHERE id_serviciu = $7
         RETURNING *`,
        [
            service.id_categorie,
            service.denumire,
            service.durata_minute,
            service.pret,
            service.is_active,
            service.descriere,
            id
        ]
    );

    return result.rows[0];
};


const patch = async (id, service) => {
    const fields = [];
    const values = [];

    if (service.id_categorie !== undefined) {
        fields.push(`id_categorie = $${values.length + 1}`);
        values.push(service.id_categorie);
    }

    if (service.denumire !== undefined) {
        fields.push(`denumire = $${values.length + 1}`);
        values.push(service.denumire);
    }

    if (service.durata_minute !== undefined) {
        fields.push(`durata_minute = $${values.length + 1}`);
        values.push(service.durata_minute);
    }

    if (service.pret !== undefined) {
        fields.push(`pret = $${values.length + 1}`);
        values.push(service.pret);
    }

    if (service.is_active !== undefined) {
        fields.push(`is_active = $${values.length + 1}`);
        values.push(service.is_active);
    }

    if (service.descriere !== undefined) {
        fields.push(`descriere = $${values.length + 1}`);
        values.push(service.descriere);
    }

    values.push(id);

    const result = await pool.query(
        `UPDATE servicii
         SET ${fields.join(", ")}
         WHERE id_serviciu = $${values.length}
         RETURNING *`,
        values
    );

    return result.rows[0];
};
const deleteById = async (id) => {
    const result = await pool.query(
        "DELETE FROM servicii WHERE id_serviciu = $1 RETURNING *",
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