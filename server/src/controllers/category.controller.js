const categoryService = require("../services/category.service");



const getCategories = async (req, res) => {
    const filters = {
        search: req.query.search,
        sortBy: req.query.sortBy,
        direction: req.query.direction,
        page: req.query.page,
        size: req.query.size
    };

    const categories = await categoryService.getAllCategories(filters);

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


const patchCategory = async (req, res) => {
    const category = await categoryService.patchCategory(
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
    patchCategory,
    deleteCategory
};