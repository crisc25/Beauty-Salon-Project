const app = require("./app");
const pool = require("../config/db");

const port = 3000;

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Eroare la conectarea la baza de date:", err);
        return;
    }

    console.log("Conectarea la PostgreSQL reușită!");
    console.log("Data serverului:", result.rows[0].now);

    app.listen(port, () => {
        console.log(`Serverul rulează pe portul ${port}`);
    });
});