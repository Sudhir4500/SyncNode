import User from "@/models/User";
import { IUser, IUserResponse } from "@/interfaces/IUser";
import { IServiceResponse } from "@/interfaces/IServiceResponse";
import { ValidationError, AuthenticationError} from "@/utils/errors";
import passwordService from "@/services/password.service";
import tokenService from '@/services/token.service';
/**
 * AuthService class provides methods for user authentication, including registration, login, token refreshing, and logout. It interacts with the User model to manage user data and utilizes the PasswordService for secure password handling and the TokenService for JWT token management.
 * This service is responsible for handling all authentication-related operations, ensuring that user credentials are securely processed and that access tokens are properly generated and validated for authenticated requests.
 */

export class AuthService {
    /**
     * Registers a new user with the provided email and password. It validates the input, checks for existing users, hashes the password, and saves the new user to the database.
     * @param email - The email address of the user to register.
     * @param password - The plain text password of the user to register.
     */
    async registerUser(
        email: string,
        password: string
    ): Promise<IServiceResponse<{ user: IUserResponse; token: string }>> {
        try {
            // 1.validation 1:Email format
            if (!this.isValidEmail(email)) {
                throw new ValidationError('Invalid email format');
            }
            // 2.validation 2:Email is already in use
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ValidationError('Email is already in use');
            }
            // 3.validation 3:Password strength
            if (!passwordService.isPasswordValid(password)) {
                throw new ValidationError(
                    'Password must be 8+ chars with uppercase, lowercase, and number'
                );
            }

            // 4.hash password
            const hashedPassword = await passwordService.hashPassword(password);

            // create a new user
            const newUser = new User({ email, password: hashedPassword, role: 'user', isActive: true });
            // save to mongoDB
            await newUser.save();
            // generate JWT token
            const token = tokenService.generateAccessToken({
                userId: newUser._id.toString(),
                email: newUser.email,
                role: newUser.role
            });
            // return success response
            return {
                success: true,
                message: 'User registered successfully',
                data: { user: this.sanitizeUser(newUser.toObject()), token },
                statusCode: 201,
                timestamp: new Date()
            };
        } catch (error) {
            // catch any errors and return a standardized error response
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Registration failed',
                statusCode: error instanceof ValidationError ? 400 : 500,
                message: 'User registration failed',
                timestamp: new Date()
            };
        }
    }

    /**
     * Login User with email and password. 
     * It validates the input, checks for user existence, compares the provided password with the stored hashed password, and generates a JWT token upon successful authentication.
     * @param email - The email address of the user to log in.
     * @param password - The plain text password of the user to log in.
     * @return A promise that resolves to an IServiceResponse containing the authenticated user data and a JWT token if successful, or an error message if authentication fails.
     */
    async loginUser(
        email: string,
        password: string
    ): Promise<IServiceResponse<{ user: IUserResponse; token: string; refreshToken: string }>> {
        try {
            // Find user by email
            const user = await User.findOne({ email }).select('+password'); // include password for comparison
            if (!user) {
                throw new AuthenticationError('Invalid email or password');
            }

            // check if user is active
            if (!user.isActive) {
                throw new AuthenticationError('Account is inactive. Please contact support.');
            }

            // compare password with stored hash
            const isPasswordValid = await passwordService.comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new AuthenticationError('Invalid email or password');
            }

            // generate JWT token
            const accessToken = tokenService.generateAccessToken({
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            });

            // generate refresh token
            const refreshToken = tokenService.generateRefreshToken(user._id.toString());
            // update the last login time
            user.lastLogin = new Date();
            await user.save();
            // return success response
            return {
                success: true,
                data: {
                    user: this.sanitizeUser(user.toObject()),
                    token: accessToken,
                    refreshToken
                },
                message: 'Login successful',
                statusCode: 200,
                timestamp: new Date()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Login failed',
                statusCode: error instanceof AuthenticationError ? 401 : 500,
                message: 'User login failed',
                timestamp: new Date()
            };
        }
    }

    /**
     * verify token
     * called by middleware to check if token is valid
     * @param token - The JWT token to verify.
     * @returns IAuthpayload -user info from token
     */
    verifyToken(token: string) {
        return tokenService.verifyToken(token);
    }

    /**
     * Helper method to validate email format 
     * prevents obvious invalid emails from being processed further, improving efficiency and user experience.
     * @param email - The email address to validate.
     * @returns A boolean indicating whether the email format is valid (true) or not (false).
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    /**
     * Remove the sensitive information from the user object before sending it in the response. This ensures that sensitive data such as passwords are not exposed in API responses, enhancing security and protecting user privacy.
     * @param user - The user object from which to remove sensitive information.
     * @returns A new user object with sensitive fields removed.
     */
    private sanitizeUser(user: IUser): IUserResponse {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser as IUserResponse;
    }
}

export default new AuthService();
