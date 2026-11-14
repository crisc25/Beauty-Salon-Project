const pool = require("../../config/db");

const getAll = async (filters = {}) => {
    const conditions = [];
    const values = [];

    // Căutare după denumire
    if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`denumire ILIKE $${values.length}`);
    }

    // Filtrare după categorie
    if (filters.id_categorie !== undefined) {
        values.push(filters.id_categorie);
        conditions.push(`id_categorie = $${values.length}`);
    }

    // Filtrare după statut
    if (filters.is_active !== undefined) {
        values.push(filters.is_active);
        conditions.push(`is_active = $${values.length}`);
    }

    // Filtrare după preț minim
    if (filters.minPrice !== undefined) {
        values.push(filters.minPrice);
        conditions.push(`pret >= $${values.length}`);
    }

    // Filtrare după preț maxim
    if (filters.maxPrice !== undefined) {
        values.push(filters.maxPrice);
        conditions.push(`pret <= $${values.length}`);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // Sortare: acceptăm doar coloanele permise
    const allowedSortFields = [
        "denumire",
        "pret",
        "durata_minute"
    ];

    const sortBy = allowedSortFields.includes(filters.sortBy)
        ? filters.sortBy
        : "id_serviciu";

    const direction = filters.direction?.toLowerCase() === "desc"
        ? "DESC"
        : "ASC";

    // Paginare
    const page = Math.max(0, Number.parseInt(filters.page, 10) || 0);
    const size = Math.min(
        100,
        Math.max(1, Number.parseInt(filters.size, 10) || 10)
    );

    const offset = page * size;

    // Numărul total de rezultate înainte de paginare
    const countResult = await pool.query(
        `SELECT COUNT(*) AS total
         FROM servicii
         ${whereClause}`,
        values
    );

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / size);

    // Rezultatele paginii curente
    const result = await pool.query(
        `SELECT *
         FROM servicii
         ${whereClause}
         ORDER BY ${sortBy} ${direction}, id_serviciu ASC
         LIMIT $${values.length + 1}
         OFFSET $${values.length + 2}`,
        [...values, size, offset]
    );

    return {
        data: result.rows,
        pagination: {
            total,
            page,
            size,
            totalPages
        }
    };
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
    if (fields.length === 0) {
        return null;
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