
const express = require("express");

const {
    getServices,
    getServiceById,
    createService,
    updateService,
    patchService,
    deleteService
} = require("../controllers/service.controller");

const authenticateAdmin = require("../middlewares/auth.middlewares");

const router = express.Router();

// Rute publice
router.get("/", getServices);
router.get("/:id", getServiceById);

// Rute protejate
router.post("/", authenticateAdmin, createService);
router.put("/:id", authenticateAdmin, updateService);
router.patch("/:id", authenticateAdmin, patchService);
router.delete("/:id", authenticateAdmin, deleteService);

module.exports = router;
