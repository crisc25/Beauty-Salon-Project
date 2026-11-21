const express = require("express");
const errorMiddleware = require("./middlewares/err.middleware");

const adminRoutes = require("./routes/admin.routes");
const statisticsRoutes = require("./routes/statistics.routes");
const serviceRoutes = require("./routes/service.routes");
const categoryRoutes = require("./routes/category.routes");
const clientRoutes = require("./routes/client.routes");
const employeeRoutes = require("./routes/employee.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const employeeServiceRoutes = require("./routes/employeeService.routes");

const app = express();

app.use(express.json());

app.use("/api/statistici", statisticsRoutes);
app.use("/api/servicii", serviceRoutes);
app.use("/api/categorii", categoryRoutes);
app.use("/api/clienti", clientRoutes);
app.use("/api/angajati", employeeRoutes);
app.use("/api/programari", appointmentRoutes);
app.use("/api/angajati-servicii", employeeServiceRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (_req, res) => {
    res.json({
        message: "Beauty Salon API is running"
    });
});


// Tratarea rutelor inexistente
app.use((req, res, next) => {
    const error = new Error(
        `Ruta ${req.method} ${req.originalUrl} nu există`
    );

    error.statusCode = 404;
    error.name = "RouteNotFoundException";

    next(error);
});

// Middleware global de gestionare a erorilor
app.use(errorMiddleware);

module.exports = app;
