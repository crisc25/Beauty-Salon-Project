const categoryModel = require("../models/category.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");

const getAllCategories = async () => {
    return await categoryModel.getAll();
};


const getCategoryById = async (id) => {
    const category = await categoryModel.getById(id);

    if (!category) {
        throw new ResourceNotFoundException(
            `Categoria cu ID-ul ${id} nu a fost găsită`
        );
    }

    return category;
};

const createCategory = async (category) => {
    return await categoryModel.create(category);
};



const updateCategory = async (id, category) => {
    const updatedCategory = await categoryModel.update(id, category);

    if (!updatedCategory) {
        throw new ResourceNotFoundException(
            `Categoria cu ID-ul ${id} nu a fost găsită`
        );
    }

    return updatedCategory;
};



const patchCategory = async (id, category) => {
    const patchedCategory = await categoryModel.patch(id, category);

    if (patchedCategory === null) {
        throw new InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }

    if (!patchedCategory) {
        throw new ResourceNotFoundException(
            `Categoria cu ID-ul ${id} nu a fost găsită`
        );
    }

    return patchedCategory;
};



const deleteCategory = async (id) => {
    const deletedCategory = await categoryModel.deleteById(id);

    if (!deletedCategory) {
        throw new ResourceNotFoundException(
            `Categoria cu ID-ul ${id} nu a fost găsită`
        );
    }

    return deletedCategory;
};
module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    patchCategory,
    deleteCategory
};