import { useState, type ReactNode } from 'react';
import { AuthContext, type User } from './AuthContext';

const parseJwt = (token: string): User | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const decoded = JSON.parse(jsonPayload);
        
        return {
            id: Number(decoded.sub || 0),
            firstName: decoded.FirstName || '',
            email: decoded.email || '',
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Client'
        };
    } catch (e) {
        console.error("Помилка декодування токена", e);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 1. Лінива ініціалізація токена (функція виконається лише один раз при старті)
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    // 2. Лінива ініціалізація юзера
    const [user, setUser] = useState<User | null>(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            const decodedUser = parseJwt(savedToken);
            if (decodedUser) {
                return decodedUser; 
            } else {
                // Якщо токен зіпсований, одразу чистимо сміття
                localStorage.removeItem('token');
            }
        }
        return null; 
    });

    

    const login = (newToken: string) => {
        const decodedUser = parseJwt(newToken);
        if (decodedUser) {
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(decodedUser);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuth: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};