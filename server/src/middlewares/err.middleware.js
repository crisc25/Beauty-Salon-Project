const errorMiddleware = (err, req, res, next) => {
    const status = err.statusCode || 500;

    res.status(status).json({
        status: status,
        error: err.name || "Internal Server Error",
        message: err.message || "A apărut o eroare pe server",
        timestamp: new Date().toISOString()
    });
};

module.exports = errorMiddleware;