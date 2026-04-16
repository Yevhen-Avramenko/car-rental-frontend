import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuth } = useAuth();

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};