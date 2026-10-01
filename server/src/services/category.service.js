const categoryModel = require("../models/category.model");

const getAllCategories = async () => {
    return await categoryModel.getAll();
};

const getCategoryById = async (id) => {
    return await categoryModel.getById(id);
};


const createCategory = async (category) => {
    return await categoryModel.create(category);
};


const updateCategory = async (id, category) => {
    return await categoryModel.update(id, category);
};

const patchCategory = async (id, category) => {
    return await categoryModel.patch(id, category);
};
const deleteCategory = async (id) => {
    return await categoryModel.deleteById(id);
};

module.exports = {
    getAllCategories,
     getCategoryById,
     createCategory,
     updateCategory,
     patchCategory,
     deleteCategory
};