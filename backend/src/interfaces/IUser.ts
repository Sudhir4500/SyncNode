export interface IUser{
    _id: string;
    email: string;
    password: string;
    role:'user' | 'admin';
    permissions?: string[];
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User response type - used when sending user data to client
 * NEVER includes password for security
 */
export interface IUserResponse extends Omit<IUser, 'password'> {}