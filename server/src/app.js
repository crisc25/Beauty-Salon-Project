const express = require("express");

const app = express();

app.use(express.json());

const serviceRoutes = require("./routes/service.routes");
const categoryRoutes = require("./routes/category.routes");
const clientRoutes = require("./routes/client.routes");
const employeeRoutes = require("./routes/employee.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const employeeServiceRoutes = require("./routes/employeeService.routes");

app.use("/api/servicii", serviceRoutes);
app.use("/api/categorii", categoryRoutes);
app.use("/api/clienti", clientRoutes);
app.use("/api/angajati", employeeRoutes);
app.use("/api/programari", appointmentRoutes);
app.use("/api/angajati-servicii", employeeServiceRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Beauty Salon API is running"
    });
});

module.exports = app;