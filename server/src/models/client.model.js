const pool = require("../../config/db");

const getAll = async (filters = {}) => {
    const values = [];
    let whereClause = "";

    if (filters.search) {
        values.push(`%${filters.search}%`);

        whereClause = `
            WHERE nume ILIKE $1
               OR prenume ILIKE $1
               OR CONCAT(nume, ' ', prenume) ILIKE $1
        `;
    }

    // Sortare
    const allowedSortFields = ["nume", "prenume"];

    const sortBy = allowedSortFields.includes(filters.sortBy)
        ? filters.sortBy
        : "nume";

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

    // Numărul total de clienți după căutare
    const countResult = await pool.query(
        `SELECT COUNT(*) AS total
         FROM clienti
         ${whereClause}`,
        values
    );

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / size);

    // Clienții paginii curente
    const result = await pool.query(
        `SELECT id_client, nume, prenume, telefon, email
         FROM clienti
         ${whereClause}
         ORDER BY ${sortBy} ${direction}, id_client ASC
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

const patch = async (id, client) => {
    const fields = [];
    const values = [];

    if (client.nume !== undefined) {
        fields.push(`nume = $${values.length + 1}`);
        values.push(client.nume);
    }

    if (client.prenume !== undefined) {
        fields.push(`prenume = $${values.length + 1}`);
        values.push(client.prenume);
    }

    if (client.telefon !== undefined) {
        fields.push(`telefon = $${values.length + 1}`);
        values.push(client.telefon);
    }

    if (client.email !== undefined) {
        fields.push(`email = $${values.length + 1}`);
        values.push(client.email);
    }

    if (client.parola !== undefined) {
        fields.push(`parola = $${values.length + 1}`);
        values.push(client.parola);
    }
    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const result = await pool.query(
        `UPDATE clienti
         SET ${fields.join(", ")}
         WHERE id_client = $${values.length}
         RETURNING *`,
        values
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
module.exports = {
    getAll,
    getById,
    create,
    update,
    patch,
    deleteById
}