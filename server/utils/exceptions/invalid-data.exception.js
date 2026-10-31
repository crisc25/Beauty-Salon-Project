const InvalidDataException = (message) => {
    const error = new Error(message);

    error.name = "InvalidDataException";
    error.statusCode = 400;

    return error;
};

module.exports = InvalidDataException;