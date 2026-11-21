
const pool = require("../../config/db");

const getRevenue = async (data_start, data_end) => {
    const result = await pool.query(
        `SELECT
            COALESCE(SUM(pret_programare), 0) AS venit_total,
            COUNT(id_programare)::int AS numar_programari_finalizate
         FROM programari
         WHERE status = 'finalizata'
           AND data_ora >= $1::date
           AND data_ora < ($2::date + INTERVAL '1 day')`,
        [data_start, data_end]
    );

    return result.rows[0];
};

module.exports = {
    getRevenue
};
