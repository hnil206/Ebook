import mongoose, { Schema } from 'mongoose';

const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\d{10}$/; // Matches 10-digit numbers
    return phoneRegex.test(phoneNumber);
};

const userSchema = new Schema(
    {
        //--provider---
        provider: {
            type: String,
            required: true,
        },
        providerId: {
            type: String,
            required: true,
            unique: true,
        },
        //-------------
        username: {
            type: String,
            required: true,
            // unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: false,
        },
        role: {
            type: [String],
            required: true,
            default: ['user'],
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: false,
        },
        dateOfBirth: {
            type: Date,
            required: false,
        },
        phoneNumber: {
            type: String,
            required: false,
            unique: true,
            validate: {
                validator: validatePhoneNumber
            }
        },
        premiumStatus: {
            isPremium: { type: Boolean, default: false },
            expiresAt: { type: Date, default: null },
        },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);
export default User;