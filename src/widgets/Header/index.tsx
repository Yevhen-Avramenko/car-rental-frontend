import { Link, NavLink } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-warm-sand border-b border-warm-border">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Логотип */}
        <Link to="/" className="text-warm-ink font-medium text-lg">
          Key<span className="text-brand-primary">2</span>Go
        </Link>

        {/* Навігація */}
        <nav className="flex items-center gap-1">
          {[
            { to: '/catalog', label: 'Каталог' },
            { to: '/about',   label: 'Про нас' },
            { to: '/contact', label: 'Контакти' },
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

        {/* Права частина */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-warm-muted hover:text-warm-ink transition-colors"
          >
            Увійти
          </Link>
          <Link
            to="/catalog"
            className="bg-brand-primary hover:bg-brand-dark text-white text-sm
                       font-medium px-4 py-2 rounded-md transition-colors"
          >
            Орендувати
          </Link>
        </div>

      </div>
    </header>
  );
};