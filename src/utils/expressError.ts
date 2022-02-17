class ExpressError extends Error {
    [x: string]: any;
    constructor(message: any, statusCode: any) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;