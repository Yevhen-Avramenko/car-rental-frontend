import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/useAuth';
import { Button } from '@/shared/ui/Button';

export const Header = () => {
    const { isAuth, user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const navLinkCls = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-2xl text-sm transition-colors ${
            isActive
                ? 'bg-warm-ink text-warm-cream'
                : 'text-warm-muted hover:text-warm-ink'
        }`;

    return (
        <header className="bg-warm-sand border-b border-warm-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

                {/* Логотип */}
                <Link to="/" className="text-warm-ink font-medium text-lg shrink-0">
                    Key<span className="text-brand-primary">2</span>Go
                </Link>

                {/* Навігація — десктоп */}
                <nav className="hidden md:flex items-center gap-1">
                    <NavLink to="/catalog" className={navLinkCls}>Каталог</NavLink>
                    <NavLink to="/p2p">P2P авто</NavLink>
                    <NavLink to="/about"   className={navLinkCls}>Про нас</NavLink>
                </nav>

                {/* Права частина — десктоп */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuth ? (
                        <>
                            {user?.role === 'Admin' && (
                                <div className="flex items-center gap-1 border-r border-warm-border pr-3 mr-1">
                                    <NavLink to="/admin/rentals" className={navLinkCls}>
                                        Бронювання
                                    </NavLink>
                                    <NavLink to="/admin/cars" className={navLinkCls}>
                                        Автопарк
                                    </NavLink>
                                </div>
                            )}
                            <NavLink to="/profile" className={navLinkCls}>
                                👤 {user?.firstName}
                            </NavLink>
                            <Button variant="ghost" onClick={handleLogout}>
                                Вийти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-warm-muted hover:text-warm-ink transition-colors"
                            >
                                Увійти
                            </Link>
                            <Link to="/register">
                                <Button>Реєстрація</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Бургер — мобільний */}
                <button
                    className="md:hidden p-2 text-warm-muted hover:text-warm-ink"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Меню"
                >
                    <div className="space-y-1.5">
                        <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Мобільне меню */}
            {menuOpen && (
                <div className="md:hidden border-t border-warm-border bg-warm-sand px-6 py-4 space-y-1">
                    <NavLink to="/catalog" className={navLinkCls} onClick={() => setMenuOpen(false)}>
                        Каталог
                    </NavLink>
                    <NavLink to="/about" className={navLinkCls} onClick={() => setMenuOpen(false)}>
                        Про нас
                    </NavLink>
                    {isAuth ? (
                        <>
                            <NavLink to="/profile" className={navLinkCls} onClick={() => setMenuOpen(false)}>
                                👤 Мій кабінет
                            </NavLink>
                            {user?.role === 'Admin' && (
                                <>
                                    <NavLink to="/admin/rentals" className={navLinkCls} onClick={() => setMenuOpen(false)}>
                                        Адмін — бронювання
                                    </NavLink>
                                    <NavLink to="/admin/cars" className={navLinkCls} onClick={() => setMenuOpen(false)}>
                                        Адмін — автопарк
                                    </NavLink>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-700"
                            >
                                Вийти
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={navLinkCls} onClick={() => setMenuOpen(false)}>
                                Увійти
                            </NavLink>
                            <NavLink to="/register" className={navLinkCls} onClick={() => setMenuOpen(false)}>
                                Реєстрація
                            </NavLink>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};