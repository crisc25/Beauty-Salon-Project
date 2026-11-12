
const express = require("express");

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    patchCategory,
    deleteCategory
} = require("../controllers/category.controller");

const authenticateAdmin = require("../middlewares/auth.middlewares");

const router = express.Router();

// Rute publice
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Rute protejate
router.post("/", authenticateAdmin, createCategory);
router.put("/:id", authenticateAdmin, updateCategory);
router.patch("/:id", authenticateAdmin, patchCategory);
router.delete("/:id", authenticateAdmin, deleteCategory);

module.exports = router;
