
const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error(
            "Autentificarea este necesară pentru această operație"
        );

        error.name = "AuthenticationException";
        error.statusCode = 401;

        return next(error);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();

    } catch (err) {
        const error = new Error(
            "Token JWT invalid sau expirat"
        );

        error.name = "AuthenticationException";
        error.statusCode = 401;

        return next(error);
    }
};

module.exports = authenticateAdmin;


// 1. Verifică dacă cererea conține headerul Authorization.
// 2. Verifică dacă tokenul este transmis cu prefixul Bearer.
// 3. Verifică semnătura și expirarea tokenului cu jwt.verify().
// 4. Dacă tokenul este valid, permite continuarea cererii prin next().
// 5. Dacă tokenul lipsește sau este invalid, returnează eroarea 401.