/**
 * This is what gets encoded in the JWT token
 * When a user logs in, we create a payload with their userId, email, role, and token timestamps (iat and exp) and sign it to generate the JWT token.
 * 
 * Why JWT?
 * - Stateless: No need to store session data on the server, making it scalable and efficient.
 * - Secure: Can be signed and encrypted to ensure data integrity and confidentiality.
 * - Flexible: Can include custom claims (like user role) for fine-grained access control.
 * - Widely Supported: Works across different platforms and languages, making it ideal for modern web applications.
 */
export interface IAuthPayload {
    userId: string; //user's mongoDB _id
    email: string; //user's email
    role: 'user' | 'admin' ; //user's role for authorization purposes
    iat: number; //issued at timestamp (in seconds)
    exp: number; //expiration timestamp (in seconds)
}