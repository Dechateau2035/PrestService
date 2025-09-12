import { Schema, model } from 'mongoose';

export interface UserDoc {
    _id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
    {
        email: { type: String, unique: true, required: true, lowercase: true, trim: true },
        name: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' }
    },
    { timestamps: true }
);

export const UserModel = model<UserDoc>('User', userSchema);
