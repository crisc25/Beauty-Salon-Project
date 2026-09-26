const categoryService = require("../services/category.service");

const getCategories = async (req, res) => {
    const categories = await categoryService.getAllCategories();

    res.json(categories);
};

const getCategoryById = async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);

    res.json(category);
};

const createCategory = async (req, res) => {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json(category);
};

const updateCategory = async (req, res) => {
    const category = await categoryService.updateCategory(
        req.params.id,
        req.body
    );

    res.json(category);
};

const deleteCategory = async (req, res) => {
    const category = await categoryService.deleteCategory(req.params.id);

    res.json(category);
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
     deleteCategory
};