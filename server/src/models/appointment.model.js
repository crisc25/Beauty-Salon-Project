const pool = require("../../config/db");

const getAll = async (filters = {}) => {
    const conditions = [];
    const values = [];

    if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(
            c.nume ILIKE $${values.length}
            OR c.prenume ILIKE $${values.length}
            OR CONCAT(c.nume, ' ', c.prenume) ILIKE $${values.length}
        )`);
    }

    if (filters.status) {
        values.push(filters.status);
        conditions.push(`p.status = $${values.length}`);
    }

    if (filters.data) {
        values.push(filters.data);
        conditions.push(`DATE(p.data_ora) = $${values.length}`);
    }

    if (filters.id_angajat !== undefined) {
        values.push(filters.id_angajat);
        conditions.push(`p.id_angajat = $${values.length}`);
    }

    if (filters.id_serviciu !== undefined) {
        values.push(filters.id_serviciu);
        conditions.push(`p.id_serviciu = $${values.length}`);
    }

    if (filters.data_start) {
        values.push(filters.data_start);
        conditions.push(`p.data_ora >= $${values.length}::date`);
    }

    if (filters.data_end) {
        values.push(filters.data_end);
        conditions.push(`p.data_ora < ($${values.length}::date + INTERVAL '1 day')`);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // Sortare după câmpuri permise
    const allowedSortFields = ["data_ora", "status"];

    const sortBy = allowedSortFields.includes(filters.sortBy)
        ? filters.sortBy
        : "data_ora";

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

    // Numărul total de programări după filtrare
    const countResult = await pool.query(
        `SELECT COUNT(*) AS total
         FROM programari p
         JOIN clienti c ON p.id_client = c.id_client
         ${whereClause}`,
        values
    );

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / size);

    // Programările paginii curente
    const result = await pool.query(
        `SELECT p.*
         FROM programari p
         JOIN clienti c ON p.id_client = c.id_client
         ${whereClause}
         ORDER BY p.${sortBy} ${direction}, p.id_programare ASC
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
    if (fields.length === 0) {
        return null;
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
const hasOverlappingAppointment = async (id_angajat, data_ora, durata_minute) => {
    const result = await pool.query(
        `SELECT EXISTS (
            SELECT 1
            FROM programari
            WHERE id_angajat = $1
              AND status IN ('programata', 'confirmata')
              AND data_ora < $2::timestamp + ($3 * INTERVAL '1 minute')
              AND data_ora + (
                  SELECT s.durata_minute * INTERVAL '1 minute'
                  FROM servicii s
                  WHERE s.id_serviciu = programari.id_serviciu
              ) > $2::timestamp
        ) AS is_occupied`,
        [id_angajat, data_ora, durata_minute]
    );

    return result.rows[0].is_occupied;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    patch,hasOverlappingAppointment,
    deleteById
}