import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuth, user } = useAuth();

    if (!isAuth) return <Navigate to="/login" replace />;
    if (user?.role !== 'Admin') return <Navigate to="/" replace />;

    return <>{children}</>;
};
