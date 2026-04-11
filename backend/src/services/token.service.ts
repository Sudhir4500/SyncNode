import jwt , {SignOptions} from 'jsonwebtoken';
import { IAuthPayload } from '@/interfaces/IAuthPayload';

export class TokenService {
    private JWT_SECRET:string;
    private JWT_EXPIRES:string | number; 
    private REFRESH_TOKEN_EXPIRES:string | number; 

    constructor(){
        if(!process.env.JWT_SECRET){
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
      
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRES = process.env.JWT_EXPIRES || '15m'; // default to 15 minutes if not set
        this.REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d'; // default to 7 days if not set
    }
    /**
     * Generates a JWT access token for the given user payload.
     * toKEN expire in 15 minutes
     * it is short lived token that is used to authenticate user requests and access protected resources.
     * @param payload - The user payload containing user information to be included in the token.
     * @return A JWT access token as a string.
     * 
     */
   generateAccessToken(payload: Omit<IAuthPayload, 'iat' | 'exp'>): string {
        const options: SignOptions = {
           expiresIn: this.JWT_EXPIRES as SignOptions['expiresIn'],
            algorithm: 'HS256' // HMAC SHA-256
        };

        return jwt.sign(payload, this.JWT_SECRET, options);
    }
    /**
     * Generates a JWT refresh token for the given user payload.
     * Refresh token expire in 7 days
     * it is long lived token that is used to obtain new access tokens without requiring the user to re-authenticate, enhancing user experience while maintaining security.
     * @param userId - The unique identifier of the user for whom the refresh token is being generated.
     * @return A JWT refresh token as a string.
     * 
     */
     generateRefreshToken(userId: string): string {
        const options: SignOptions = {
            expiresIn: this.REFRESH_TOKEN_EXPIRES as SignOptions['expiresIn'],
            algorithm: 'HS256'
        };

        return jwt.sign({ userId }, this.JWT_SECRET, options);
    }

    /**
     * Verifies the validity of a given JWT token and returns the decoded payload if the token is valid.
     * @param token - The JWT token to be verified.
     * @return IAuthPayload - The decoded payload of the token if it is valid.
     * @throws -jsonwebtoken.JsonWebTokenError
     * -tokenexpiredError
     * if the token is invalid or has expired, an error will be thrown.
     */
    verifyToken(token: string): IAuthPayload {
        try {
            return jwt.verify(token, this.JWT_SECRET, {
                algorithms: ['HS256']
            }) as IAuthPayload;
        } catch (err) {
            // Distinguish between different error types
            if (err instanceof jwt.TokenExpiredError) {
                throw new Error('Token expired');
            }
            if (err instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            throw new Error('Token verification failed');
        }
    }
    /**
     * Decodes a JWT token without verifying its signature and returns the decoded payload.
     * @param token - The JWT token to be decoded.
     * @return IAuthPayload - The decoded payload of the token.
     * This method is useful for extracting information from the token without validating its authenticity, but it should be used with caution as it does not guarantee the integrity of the data.
     * used for debugging or when you trust the source of the token and just want to read its contents without verifying it.
     */
    decodeToken(token: string): IAuthPayload | null {
        return jwt.decode(token) as IAuthPayload | null;
    }
}

export default new TokenService();