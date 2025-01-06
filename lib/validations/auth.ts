import { z } from 'zod';

// Password requirements:
// - At least 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signUpSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            passwordRegex,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const signInSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            passwordRegex,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
}); 