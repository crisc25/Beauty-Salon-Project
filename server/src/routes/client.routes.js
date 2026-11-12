
const express = require("express");

const {
    getClients,
    getClientById,
    createClient,
    updateClient,
    patchClient,
    deleteClient
} = require("../controllers/client.controller");

const authenticateAdmin = require("../middlewares/auth.middlewares");

const router = express.Router();

// Rute publice
router.get("/", getClients);
router.get("/:id", getClientById);

// Rute protejate
router.post("/", authenticateAdmin, createClient);
router.put("/:id", authenticateAdmin, updateClient);
router.patch("/:id", authenticateAdmin, patchClient);
router.delete("/:id", authenticateAdmin, deleteClient);

module.exports = router;
