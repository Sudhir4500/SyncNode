import {Schema, model} from 'mongoose';
import { IUser } from '@/interfaces/IUser';
/**
 * Mongoose schema for the User model, defining the structure of user documents in the MongoDB database. 
 * It includes fields for email and password, along with validation rules such as required fields, uniqueness, and formatting. 
 * The password field is set to not be selected by default when querying the database for security reasons.
 */
const userSchema =new Schema<IUser>({
    email: {type: String, required: true, unique: true,lowercase: true, trim: true},
    password: {type: String, required: true, select: false},
}, {timestamps: true});
/**
 * Mongoose model for the User collection, created from the userSchema. 
 * This model provides an interface for interacting with the User collection in the MongoDB database, allowing for operations such as creating, reading, updating, and deleting user documents.
 */
const User = model<IUser>('User', userSchema);
export default User;