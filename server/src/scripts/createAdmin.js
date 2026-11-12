
require("dotenv").config();

const bcrypt = require("bcrypt");
const adminModel = require("../models/admin.model");

const initializeAdmin = async () => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        throw new Error(
            "Datele administratorului lipsesc din .env"
        );
    }

    const existingAdmin = await adminModel.getByUsername(username);

    if (existingAdmin) {
        console.log("Administratorul există deja.");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await adminModel.create(
        username,
        hashedPassword
    );

    console.log("Administrator inițializat:", admin);
};

module.exports = initializeAdmin;


// bcrypt.hash(password, 12) transformă parola într-un hash.
// 12 reprezintă costul de calcul utilizat de bcrypt.
// getByUsername() verifică dacă administratorul există deja.
// create() salvează datele în PostgreSQL.
// pool.end() închide conexiunea după terminarea scriptului.