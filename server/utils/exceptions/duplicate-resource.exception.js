const DuplicateResourceException = (message) => {
    const error = new Error(message);

    error.name = "DuplicateResourceException";
    error.statusCode = 409;

    return error;
};

module.exports = DuplicateResourceException;