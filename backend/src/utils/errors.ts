/**
 * custom error classes for handling specific error scenarios in the application. 
 * These classes extend the built-in Error class and provide
 * custom error messages and HTTP status codes for different types of errors that may occur in the application, such as authentication errors, authorization errors, validation errors, and not found errors.
 * 
 * By using custom error classes, we can standardize error handling across the application and provide more meaningful error messages to clients when something goes wrong.
 */

/**
 * Base class for all application-specific errors
 * This class extends the built-in Error class and adds additional properties for HTTP status code and operational error flag.
 * The isOperational flag is used to differentiate between expected operational errors (like validation failures) and unexpected programming errors (like bugs).
 * By setting the prototype explicitly, we ensure that instanceof checks work correctly for these custom error classes.
 */
export class AppError extends Error{
    constructor(
        public message: string,
        public statusCode: number,
        public isOperational: boolean = true, //to differentiate between operational errors (expected) and programming errors (unexpected)
    ){
        super(message);//call parent constructor
        Object.setPrototypeOf(this, AppError.prototype); //fix prototype chain
    }
}

/**
 * Error class for authentication-related errors (e.g., invalid credentials, token issues)
 */
export class ValidationError extends AppError {
    constructor(message: string){
        super(message, 400);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Error class for authorization-related errors (e.g., insufficient permissions)
 */
export class AuthorizationError extends AppError {
    constructor(message: string){
        super(message, 403);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}
/**
 * Error class for Authentication-related errors (e.g., missing or invalid JWT token)
 */
export class AuthenticationError extends AppError {
    constructor(message: string){
        super(message, 401);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * Error class for Not Found errors (e.g., resource not found)
 */
export class NotFoundError extends AppError {
    constructor(message: string){
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}