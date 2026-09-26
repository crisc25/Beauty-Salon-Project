const pool = require("../../config/db");

const getAllServices = async () => {
    const result = await pool.query(`
        SELECT *
        FROM servicii
        ORDER BY id_serviciu
    `);

    return result.rows;
};

const getServiceById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM servicii WHERE id_serviciu = $1",
        [id]
    );
        return result.rows[0];
}

const createService = async (service) => {
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

const updateService = async (id, service) => {
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

const deleteService = async (id) => {
    const result = await pool.query(
        "DELETE FROM servicii WHERE id_serviciu = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
}