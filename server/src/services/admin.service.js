
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminModel = require("../models/admin.model");

const login = async (username, password) => {
    // Căutăm administratorul în baza de date
    const admin = await adminModel.getByUsername(username);

    // Verificăm dacă administratorul există
    if (!admin) {
        const error = new Error("Username sau parolă incorectă");
        error.name = "AuthenticationException";
        error.statusCode = 401;
        throw error;
    }

    // Verificăm parola introdusă cu hash-ul din baza de date
    const passwordMatch = await bcrypt.compare(
        password,
        admin.password
    );

    if (!passwordMatch) {
        const error = new Error("Username sau parolă incorectă");
        error.name = "AuthenticationException";
        error.statusCode = 401;
        throw error;
    }

    // Verificăm existența cheii secrete JWT
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET nu este configurat");
    }

    // Generăm tokenul JWT
    const token = jwt.sign(
        {
            id: admin.id,
            username: admin.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );

    return {
        message: "Autentificare reușită",
        token
    };
};

module.exports = {
    login
};

// 1. Caută administratorul după username.
// 2. Verifică parola folosind bcrypt.compare().
// 3. Dacă datele sunt greșite, generează eroarea 401 Unauthorized.
// 4. Dacă datele sunt corecte, generează un token JWT.
// 5. Returnează mesajul și tokenul.