class DuplicateResourceException extends Error {
    constructor(message) {
        super(message);
        this.name = "DuplicateResourceException";
        this.statusCode = 409;
    }
}

module.exports = DuplicateResourceException;