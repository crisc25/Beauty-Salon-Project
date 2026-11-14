const pool = require("../../config/db");


const getAll = async (filters = {}) => {
    const values = [];
    let whereClause = "";

    if (filters.search) {
        values.push(`%${filters.search}%`);
        whereClause = `WHERE nume_categorie ILIKE $1`;
    }

    // Sortare
    const allowedSortFields = ["nume_categorie", "id_categorie"];

    const sortBy = allowedSortFields.includes(filters.sortBy)
        ? filters.sortBy
        : "id_categorie";

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

    // Numărul total de categorii după căutare
    const countResult = await pool.query(
        `SELECT COUNT(*) AS total
         FROM categorii
         ${whereClause}`,
        values
    );

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / size);

    // Categoriile paginii curente
    const result = await pool.query(
        `SELECT *
         FROM categorii
         ${whereClause}
         ORDER BY ${sortBy} ${direction}, id_categorie ASC
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

const patch = async (id, category) => {
    const fields = [];
    const values = [];

    if (category.nume_categorie !== undefined) {
        fields.push(`nume_categorie = $${values.length + 1}`);
        values.push(category.nume_categorie);
    }

    if (category.descriere !== undefined) {
        fields.push(`descriere = $${values.length + 1}`);
        values.push(category.descriere);
    }
    if (fields.length === 0) {
        return null;
    }
    values.push(id);

    const result = await pool.query(
        `UPDATE categorii
         SET ${fields.join(", ")}
         WHERE id_categorie = $${values.length}
         RETURNING *`,
        values
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
    patch,
    deleteById
};