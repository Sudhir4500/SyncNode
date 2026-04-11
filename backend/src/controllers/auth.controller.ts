import { Request, Response } from 'express';
import authService from '@/services/auth.service';
import tokenService from '@/services/token.service';

/**
 * AUTH CONTROLLER - SINGLE RESPONSIBILITY
 * 
 * Controllers handle:
 * 1. Extract data from HTTP request
 * 2. Call service layer (business logic)
 * 3. Send HTTP response to client
 * 
 * Controllers DO NOT contain:
 * - Database queries (that's in services)
 * - Business logic (that's in services)
 * - Password hashing (that's in services)
 * 
 * Benefits:
 * - Easy to test (mock service layer)
 * - Can reuse service from multiple controllers
 * - HTTP concerns separated from business logic
 */
export class AuthController {
    /**
     * REGISTER ENDPOINT
     * POST /api/auth/register
     * Body: { email, password }
     * 
     * What happens:
     * 1. Extract email and password from request body
     * 2. Call authService.registerUser()
     * 3. Send response back to client
     */
    async register(req: Request, res: Response): Promise<void> {
        // Extract from request body
        const { email, password } = req.body;

        // Call service (where business logic lives)
        const result = await authService.registerUser(email, password);

        // Send response to client
        res.status(result.statusCode).json(result);
    }

    /**
     * LOGIN ENDPOINT
     * POST /api/auth/login
     * Body: { email, password }
     * Returns: { user, token, refreshToken }
     */
    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        const result = await authService.loginUser(email, password);

        // If using cookies for refresh token (more secure than localStorage)
        if (result.success && result.data?.refreshToken) {
            res.cookie('refreshToken', result.data.refreshToken, {
                httpOnly: true,      // Can't be accessed by JavaScript (prevents XSS)
                secure: true,        // Only sent over HTTPS
                sameSite: 'strict',  // Prevents CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
        }

        res.status(result.statusCode).json(result);
    }

    /**
     * REFRESH TOKEN ENDPOINT
     * POST /api/auth/refresh
     * 
     * Why? Access tokens expire in 15 mins
     * Instead of asking user to login again:
     * 1. Client sends refresh token
     * 2. Server validates refresh token
     * 3. Server creates new access token
     * 4. Client uses new access token
     */
    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.status(401).json({
                    success: false,
                    error: 'No refresh token provided',
                    statusCode: 401,
                    timestamp: new Date(),
                });
                return;
            }

            // Verify refresh token
            const payload = authService.verifyToken(refreshToken);

            // Create new access token
            const newAccessToken = tokenService.generateAccessToken({
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            });

            res.json({
                success: true,
                data: { token: newAccessToken },
                statusCode: 200,
                timestamp: new Date(),
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                error: 'Invalid refresh token',
                statusCode: 401,
                timestamp: new Date(),
            });
        }
    }

    /**
     * LOGOUT ENDPOINT
     * POST /api/auth/logout
     * 
     * What happens:
     * 1. Clear refresh token cookie
     * 2. Client should also clear access token from AsyncStorage
     */
    logout(req: Request, res: Response): void {
        res.clearCookie('refreshToken');
        res.json({
            success: true,
            message: 'Logged out successfully',
            statusCode: 200,
            timestamp: new Date(),
        });
    }
}

export default new AuthController();