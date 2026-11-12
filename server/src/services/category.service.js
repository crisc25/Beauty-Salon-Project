const categoryModel = require("../models/category.model");
const ResourceNotFoundException = require("../../utils/exceptions/resource-not-found.exception");
const InvalidDataException = require("../../utils/exceptions/invalid-data.exception");
const DuplicateResourceException = require("../../utils/exceptions/duplicate-resource.exception");


const validateId = (id) => {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw InvalidDataException("ID-ul categoriei este invalid");
    }
};

const getAllCategories = async () => {
    return await categoryModel.getAll();
};


const getCategoryById = async (id) => {
    validateId(id);

    const category = await categoryModel.getById(id);

    if (!category) {
        throw ResourceNotFoundException(
            `Categoria cu ID-ul ${id} nu a fost găsită`
        );
    }

    return category;
};


const createCategory = async (category) => {
    if (!category || !category.nume_categorie ||
        typeof category.nume_categorie !== "string" ||
        !category.nume_categorie.trim()) {
        throw InvalidDataException(
            "Denumirea categoriei este obligatorie"
        );
    }

    try {
        return await categoryModel.create(category);
    } catch (error) {
        if (error.code === "23505") {
            throw  DuplicateResourceException(
                "Categoria există deja"
            );
        }
        throw error;
    }
};

const updateCategory = async (id, category) => {
    validateId(id);

    if (
        !category ||
        typeof category !== "object" ||
        Array.isArray(category)
    ) {
        throw InvalidDataException("Datele categoriei sunt invalide");
    }

    if (
        typeof category.nume_categorie !== "string" ||
        !category.nume_categorie.trim()
    ) {
        throw InvalidDataException(
            "Denumirea categoriei este obligatorie"
        );
    }

    if (
        category.descriere !== undefined &&
        category.descriere !== null &&
        typeof category.descriere !== "string"
    ) {
        throw InvalidDataException(
            "Descrierea categoriei trebuie să fie text"
        );
    }

    try {
        const updatedCategory = await categoryModel.update(id, category);

        if (!updatedCategory) {
            throw ResourceNotFoundException(
                `Categoria cu ID-ul ${id} nu a fost găsită`
            );
        }

        return updatedCategory;
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException("Categoria există deja");
        }

        throw error;
    }
};

const patchCategory = async (id, category) => {
    validateId(id);

    if (
        !category ||
        typeof category !== "object" ||
        Array.isArray(category)
    ) {
        throw InvalidDataException("Datele trimise sunt invalide");
    }

    const allowedFields = ["nume_categorie", "descriere"];
    const fields = Object.keys(category);

    if (fields.length === 0) {
        throw InvalidDataException(
            "Trebuie specificat cel puțin un câmp pentru modificare"
        );
    }

    if (fields.some(field => !allowedFields.includes(field))) {
        throw InvalidDataException(
            "Cererea conține câmpuri care nu pot fi modificate"
        );
    }

    if (
        category.nume_categorie !== undefined &&
        (
            typeof category.nume_categorie !== "string" ||
            !category.nume_categorie.trim()
        )
    ) {
        throw InvalidDataException(
            "Denumirea categoriei nu poate fi goală"
        );
    }

    if (
        category.descriere !== undefined &&
        category.descriere !== null &&
        typeof category.descriere !== "string"
    ) {
        throw InvalidDataException(
            "Descrierea categoriei trebuie să fie text"
        );
    }

    try {
        const patchedCategory = await categoryModel.patch(id, category);

        if (!patchedCategory) {
            throw ResourceNotFoundException(
                `Categoria cu ID-ul ${id} nu a fost găsită`
            );
        }

        return patchedCategory;
    } catch (error) {
        if (error.code === "23505") {
            throw DuplicateResourceException(
                "Categoria există deja"
            );
        }

        throw error;
    }
};

const deleteCategory = async (id) => {
    validateId(id);

    const deletedCategory = await categoryModel.deleteById(id);

    if (!deletedCategory) {
        throw ResourceNotFoundException(
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