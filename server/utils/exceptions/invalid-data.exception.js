class InvalidDataException extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidDataException";
        this.statusCode = 400;
    }
}

module.exports = InvalidDataException;