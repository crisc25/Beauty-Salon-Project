const ResourceNotFoundException = (message) => {
    const error = new Error(message);

    error.name = "ResourceNotFoundException";
    error.statusCode = 404;

    return error;
};

module.exports = ResourceNotFoundException;