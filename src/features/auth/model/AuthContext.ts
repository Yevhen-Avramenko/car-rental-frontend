import { createContext } from 'react';

export interface User {
    id: number;
    firstName: string;
    email: string;
    role: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuth: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// Експортуємо лише об'єкт контексту
export const AuthContext = createContext<AuthContextType | undefined>(undefined);