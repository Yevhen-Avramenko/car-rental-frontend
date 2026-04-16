import { Link, NavLink,useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/useAuth';
import { Button } from '@/shared/ui/Button';

export const Header = () => {
    const { isAuth, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-warm-sand border-b border-warm-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
                <Link to="/" className="text-warm-ink font-medium text-lg">
                    Key<span className="text-brand-primary">2</span>Go
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    <NavLink to="/catalog" className={({ isActive }) => `px-4 py-2 rounded-2xl text-sm ${isActive ? 'bg-warm-ink text-warm-cream' : 'text-warm-muted'}`}>
                        Каталог
                    </NavLink>
                </nav>

                <div className="flex items-center gap-4">
                    {isAuth ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-warm-ink">Привіт, {user?.firstName}!</span>
                            <Button variant="ghost" onClick={handleLogout}>Вийти</Button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-warm-muted hover:text-warm-ink">Увійти</Link>
                            <Link to="/register"><Button>Реєстрація</Button></Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};