import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export const Header = () => {
    // Тимчасова заглушка для перевірки дизайну.
    // Пізніше ми підключимо сюди реальний стан авторизації (isAuth).
    const isAuth = false;

    return (
        <header className="bg-warm-sand border-b border-warm-border">
            <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
                
                {/* Логотип */}
                <Link to="/" className="text-warm-ink font-medium text-lg">
                    Key<span className="text-brand-primary">2</span>Go
                </Link>

                {/* Центральна навігація */}
                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { to: '/', label: 'Головна' },
                        { to: '/catalog', label: 'Каталог' },
                        { to: '/about', label: 'Про нас' },
                    ].map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-2xl text-sm transition-colors ${
                                    isActive
                                        ? 'bg-warm-ink text-warm-cream'
                                        : 'text-warm-muted hover:text-warm-ink'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Права частина (Авторизація / Кабінет) */}
                <div className="flex items-center gap-3">
                    {isAuth ? (
                        <>
                            <Link to="/profile" className="text-sm text-warm-muted hover:text-warm-ink transition-colors">
                                Кабінет
                            </Link>
                            <Button variant="ghost" onClick={() => console.log('Вихід')}>
                                Вийти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-warm-muted hover:text-warm-ink transition-colors">
                                Увійти
                            </Link>
                            <Link to="/register">
                                <Button>Реєстрація</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};