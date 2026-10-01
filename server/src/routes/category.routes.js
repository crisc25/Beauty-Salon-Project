const express = require("express");

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    patchCategory,
    deleteCategory
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.patch("/:id", patchCategory);
router.delete("/:id", deleteCategory);


module.exports = router;