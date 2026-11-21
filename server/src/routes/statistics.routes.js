
const express = require("express");

const {
    getRevenue
} = require("../controllers/statistics.controller");

const authenticateAdmin = require("../middlewares/auth.middlewares");

const router = express.Router();

// Rută protejată – accesibilă doar administratorului
router.get("/venituri", authenticateAdmin, getRevenue);

module.exports = router;
