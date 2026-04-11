import bcrypt from "bcryptjs";
/**
 * PasswordService class provides methods for hashing passwords using bcrypt.
 * This service is responsible for securely hashing user passwords before storing them in the database, ensuring that plain text passwords are never saved and enhancing the security of user data.
 */
export class PasswordService {
    /**
     * Hash a plain text password using bcrypt.
     * @param password - The plain text password to hash.
     * @returns A promise that resolves to the hashed password string.     
     */
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10; // Number of salt rounds for bcrypt
        return bcrypt.hash(password, saltRounds);
    }
    /**
     * Compare a plain text password with a hashed password to check if they match.
     * Why not just hash(inputPassword) === storedHash?
     * - bcrypt hashes with random salt
     * - Same password produces different hashes
     * - bcryptjs.compare() knows how to check properly
     * 
     * @param password - The plain text password to compare.
     * @param hashedPassword - The hashed password to compare against.
     * @returns A promise that resolves to a boolean indicating whether the passwords match (true) or not (false).
     */
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * validates the password against defined criteria (e.g., minimum length, complexity).
     * @param password - The plain text password to validate.
     * @return A boolean indicating whether the password meets the defined criteria (true) or not (false).
     */
    isPasswordValid(password: string): boolean {
        // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    }

}

/**
 * Exporting a singleton instance of PasswordService to be used throughout the application. This ensures that there is only one instance of the service, which can be easily imported and used wherever password hashing or comparison is needed.
 */
export default new PasswordService();