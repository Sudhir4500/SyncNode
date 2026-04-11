// middleware for authentication and authorization
import { Request, Response, NextFunction } from 'express';
import { IAuthPayload } from '@/interfaces/IAuthPayload';
import authService from '@/services/auth.service';
import { AuthenticationError } from '@/utils/errors';

/**
 * Extend Express Request to include user property for authenticated user information.
 * 
 */
declare global {
    namespace Express {
        interface Request {
            user?: IAuthPayload;
        }
    }
}
/**
 * Authentication middleware to verify JWT tokens and attach user information to the request object.
 *  It checks for the presence of an Authorization header, validates the token, and extracts user details to be used in subsequent request handling.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        // get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('Authorization header missing or malformed');
        }
        // extract token
        const token = authHeader.slice(7); // remove 'Bearer ' prefix
        // verify token and get user info
        const userpayload = authService.verifyToken(token);
        // attach user info to request object
        req.user = userpayload;
        // proceed to next middleware or route handler
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error instanceof Error ? error.message : 'Authentication failed',
            statusCode: 401,
            message: 'Unauthorized',
            timestamp: new Date()
        })
    }
};

/**
 * Authorization middleware to check if the authenticated user has the required role to access a route. It compares the user's role from the JWT payload with the allowed roles specified for the route and either allows access or returns a 403 Forbidden response.
 */
export const authorize =(...allowedRoles:string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AuthenticationError('User not authenticated');
            }
            // check if user's role is in allowed roles
            if (!allowedRoles.includes(req.user.role)) {
                throw new Error('Forbidden: Insufficient permissions');
            }
            // user is authorized, proceed to next middleware or route handler
            next();
        } catch (error) {
            res.status(error instanceof AuthenticationError ? 401 : 403).json({
                success: false,
                error: error instanceof Error ? error.message : 'Authorization failed',
                statusCode: error instanceof AuthenticationError ? 401 : 403,
                message: 'Forbidden',
                timestamp: new Date()
            });
        }
    };
}
