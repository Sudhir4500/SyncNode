/**
 * Load environment variables from .env file FIRST
 * This allows us to use environment variables defined in the .env file throughout our application, such as database connection strings, API keys, and other configuration settings.
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "@/app";
 
/**
 * Connect to MongoDB using Mongoose
 * The connection string is retrieved from the environment variable MONGODB_URI.
 */
const MONGODB_URI = process.env.MONGO_URI;
/**
 * if Mongo_URI isnot define, log an error message and exit the process with a non-zero status code to indicate that the application cannot start without a valid MongoDB connection string.
 */
if (!MONGODB_URI) {
    console.error("ERROR: MONGODB_URI environment variable is not defined");
    // Exit the process with a non-zero status code to indicate an error
    process.exit(1);
}

mongoose.connect(MONGODB_URI).then(()=>{
    console.log("Connected to MongoDB");
    // Start the Express server after successful database connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err)=>{
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
});
