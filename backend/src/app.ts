import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import healthRoutes from '@/routes/health';
import authRoutes from '@/routes/auth';  // ← ADD THIS
/**
 * setup the swagger documentation for the API using swagger-jsdoc and swagger-ui-express.
 * This file defines the configuration options for generating Swagger documentation for the Note App API. 
 * It specifies the OpenAPI version, API information (title, version, description), server details, and the paths to the API route files where Swagger comments are defined.
 */
import { swaggerOptions } from './config/swagger';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
/**
 * Set custom DNS servers for the application to use when resolving domain names.
 * This is done to ensure that the application uses specific DNS servers (in this case, Cloudflare's DNS servers) for domain name resolution, which can help improve performance and reliability when connecting to external services or APIs.
 */
import dns from "node:dns/promises";   
dns.setServers(["1.1.1.1", "1.0.0.1"]);

/**
 * Initialize Swagger Documentation
 * swaggerJsdoc generates the Swagger specification based on the provided options, and swaggerUi.serve and swaggerUi.setup are used to serve the Swagger UI at the /api-docs endpoint.
 */
const swaggerSpec = swaggerJsdoc(swaggerOptions);


/**
 * Initialize Express Application
 * @type {Application}
 * it is used to create an instance of the Express application, which will be used to define routes, middleware, and other configurations for the backend server.
 */
const app: Application = express();

/**
 * Middleware Configuration
 * - CORS: Enable Cross-Origin Resource Sharing to allow requests from different origins.
 * - JSON Parsing: Use express.json() to parse incoming JSON payloads in request bodies.
 */
app.use(cors());
app.use(express.json());
/**
 * Swagger UI Route
 * This route serves the Swagger UI at the /api-docs endpoint, allowing developers to access the API documentation in a user-friendly interface.
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * API Routes
 */
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

/**
 * Export the Express application instance
 * This allows other parts of the application (such as the server entry point) to import and use the configured Express app to start the server and handle incoming requests.
 */
export default app;