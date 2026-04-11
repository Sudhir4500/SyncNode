/**
 * Standard response format for all API endpoints
 * This ensures consistency throughout the app (DRY principle)
 * 
 * Why? Every endpoint returns the same structure:
 * - success: boolean (was request successful?)
 * - data: T (generic - could be User, Note, array, etc.)
 * - error: string (error message if failed)
 * - statusCode: number (HTTP status)
 * - timestamp: Date (when this response was generated)
 */
export interface IServiceResponse<T=any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    statusCode: number;
    timestamp: Date;
}