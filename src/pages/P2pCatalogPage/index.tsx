import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getP2pCars } from '@/entities/p2p/api/p2pService';
import { P2pCarCard } from '@/entities/p2p/ui/P2pCarCard';
import type { CarResponseDto } from '@/entities/car/model/types';
import { useAuth } from '@/features/auth/model/useAuth';

export const P2pCatalogPage = () => {
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    const [cars,    setCars]    = useState<CarResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getP2pCars().then(setCars).finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="text-xs text-brand-primary font-medium uppercase tracking-widest">
                        P2P оренда
                    </span>
                    <h1 className="text-3xl font-medium text-warm-ink mt-1">
                        Авто від власників
                    </h1>
                    <p className="text-warm-muted mt-1">
                        Домовляйтесь напряму — без посередників та оплати через сайт
                    </p>
                </div>
                {isAuth && (
                    <button
                        onClick={() => navigate('/p2p/my')}
                        className="bg-warm-ink text-warm-cream text-sm px-4 py-2 rounded-lg hover:bg-warm-ink/90 transition"
                    >
                        Мої оголошення
                    </button>
                )}
            </div>

            {/* Інфо-банер */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 flex gap-3 items-start">
                <span className="text-amber-500 text-lg shrink-0">ℹ️</span>
                <p className="text-sm text-amber-800">
                    P2P авто — це оголошення від звичайних користувачів. Оплата та умови оренди
                    обговорюються безпосередньо з власником. Key2Go не несе відповідальності
                    за ці угоди.
                </p>
            </div>

            {/* Каталог */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-warm-cream rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : cars.length === 0 ? (
                <div className="text-center py-20 text-warm-muted">
                    <p className="text-5xl mb-4">🚗</p>
                    <p className="text-lg font-medium text-warm-ink">Поки немає оголошень</p>
                    {isAuth ? (
                        <button
                            onClick={() => navigate('/p2p/my')}
                            className="mt-4 text-brand-primary text-sm underline"
                        >
                            Додайте своє авто першим
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 text-brand-primary text-sm underline"
                        >
                            Увійдіть щоб додати оголошення
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cars.map(car => (
                        <P2pCarCard key={car.id} car={car} />
                    ))}
                </div>
            )}
        </div>
    );
};