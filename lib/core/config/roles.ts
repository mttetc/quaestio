export type UserRole = 'user' | 'admin';

export const isAdmin = (role: UserRole) => role === 'admin'; 