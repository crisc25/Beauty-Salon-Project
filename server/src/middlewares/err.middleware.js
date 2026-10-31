

const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let status = err.statusCode || 500;
    let error = err.name || "Internal Server Error";
    let message = err.message || "A apărut o eroare pe server";


    if (err.type === "entity.parse.failed") {
        status = 400;
        error = "InvalidDataException";
        message = "Formatul JSON transmis este invalid";
    }
    //  erori PostgreSQL
    switch (err.code) {
        case "23505":
            status = 409;
            error = "DuplicateResourceException";
            message = "Resursa există deja";
            break;

        case "23503":
            status = 409;
            error = "ForeignKeyViolation";
            message = "Operația nu poate fi efectuată din cauza unei referințe invalide sau a unor înregistrări asociate";
            break;

        case "23502":
        case "23514":
        case "22P02":
            status = 400;
            error = "InvalidDataException";
            message = "Datele furnizate sunt invalide";
            break;
    }

   
    if (status >= 500) {
        console.error(err);

        status = 500;
        error = "Internal Server Error";
        message = "A apărut o eroare internă pe server";
    }

    res.status(status).json({
        status,
        error,
        message,
        timestamp: new Date().toISOString()
    });
};

module.exports = errorMiddleware;
