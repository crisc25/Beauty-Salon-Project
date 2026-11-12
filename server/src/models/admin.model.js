
const pool = require("../../config/db");

const getByUsername = async (username) => {
    const result = await pool.query(
        "SELECT * FROM admins WHERE username = $1",
        [username]
    );

    return result.rows[0];
};

const create = async (username, password) => {
    const result = await pool.query(
        `INSERT INTO admins (username, password)
         VALUES ($1, $2)
         RETURNING id, username`,
        [username, password]
    );

    return result.rows[0];
};

module.exports = {
    getByUsername,
    create
};


// - getByUsername() caută administratorul în baza de date.
// - create() introduce administratorul în tabel.
// - RETURNING id, username returnează doar ID-ul și username-ul, fără parolă.
// modelul nu generează hash-ul parolei. Acest lucru îl vom face în următoarea etapă, folosind bcrypt, înainte de a apela metoda create().
// conexiunea PostgreSQL este importată corect;

// interogările folosesc parametri $1, deci evită SQL injection;
// metoda getByUsername() caută administratorul;
// metoda create() îl salvează și nu returnează parola.