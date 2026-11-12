
const app = require("./app");
const pool = require("../config/db");
const initializeAdmin = require("./scripts/createAdmin");

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Verificăm conexiunea la PostgreSQL
        const result = await pool.query("SELECT NOW()");

        console.log("Conectarea la PostgreSQL reușită!");
        console.log("Data serverului:", result.rows[0].now);

        // Inițializăm administratorul
        await initializeAdmin();

        // Pornim serverul
        app.listen(port, () => {
            console.log(`Serverul rulează pe portul ${port}`);
        });

    } catch (error) {
        console.error("Eroare la pornirea serverului:", error);
        process.exit(1);
    }
};

startServer();
