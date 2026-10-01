const express = require("express");

const {
    getClients,
    getClientById,
    createClient,
    updateClient,
    patchClient,
    deleteClient
} = require("../controllers/client.controller");

const router = express.Router();

router.get("/", getClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.put("/:id", updateClient);
router.patch("/:id", patchClient);
router.delete("/:id", deleteClient);

module.exports = router;