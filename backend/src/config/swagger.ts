/**
 * This file is responsible for setting up Swagger documentation for the API.
 */
import type { Options } from "swagger-jsdoc";

export const swaggerOptions: Options ={
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Note App API",
            version: "1.0.0",
            description: "API documentation for the Note App"
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development server"
            }
        ]
    },
    // points to where the API routes are defined, and swagger-jsdoc will look for JSDoc comments in these files to generate the API documentation.
    apis: ["./src/routes/*.ts","./src/controllers/*.ts"] // Path to the API route files where Swagger comments are defined
}