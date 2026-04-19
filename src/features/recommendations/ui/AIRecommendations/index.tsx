import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getRecommendations,
    getCarsByIds,
    type RecommendationItem,
} from '../../api/recommendationService';
import type { CarResponseDto } from '@/entities/car/model/types';

// Скелетон-картка поки завантажується
const SkeletonCard = () => (
    <div className="bg-white border border-warm-border rounded-xl overflow-hidden animate-pulse">
        <div className="h-36 bg-warm-cream" />
        <div className="p-4 space-y-2">
            <div className="h-4 bg-warm-cream rounded w-3/4" />
            <div className="h-3 bg-warm-cream rounded w-1/2" />
            <div className="h-3 bg-warm-cream rounded w-full mt-3" />
        </div>
    </div>
);

interface EnrichedRec {
    car: CarResponseDto;
    reason: string;
}

interface AIRecommendationsProps {
    /** Компактний режим для ProfilePage */
    compact?: boolean;
}

export const AIRecommendations = ({ compact = false }: AIRecommendationsProps) => {
    const navigate = useNavigate();
    const [recs, setRecs] = useState<EnrichedRec[]>([]);
    const [isAi, setIsAi] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getRecommendations();
                const cars = await getCarsByIds(
                    data.recommendations.map(r => r.carId)
                );

                // Зберігаємо порядок і прив'язуємо reason
                const enriched: EnrichedRec[] = data.recommendations
                    .map((rec: RecommendationItem) => {
                        const car = cars.find(c => c.id === rec.carId);
                        return car ? { car, reason: rec.reason } : null;
                    })
                    .filter(Boolean) as EnrichedRec[];

                setRecs(enriched);
                setIsAi(data.isAiGenerated);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (error) return null; // мовчки ховаємо якщо щось пішло не так

    return (
        <section className={compact ? 'mt-10' : 'max-w-6xl mx-auto px-6 pb-14'}>
            {/* Заголовок блоку */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span className="text-xs text-brand-primary font-medium uppercase tracking-wide">
                        {isAi ? 'ШІ-підбір' : 'Популярне'}
                    </span>
                </div>
                <h2 className="text-xl font-medium text-warm-ink">
                    {isAi ? 'Рекомендовано для вас' : 'Топ авто тижня'}
                </h2>
                {isAi && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-warm-muted bg-warm-cream border border-warm-border px-2 py-1 rounded-full">
                        <span>✦</span> на основі ваших оренд
                    </span>
                )}
            </div>

            {/* Сітка карток */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {loading
                    ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
                    : recs.map(({ car, reason }) => (
                        <div
                            key={car.id}
                            onClick={() => navigate(`/cars/${car.id}`)}
                            className="bg-white border border-warm-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group"
                        >
                            {/* Фото */}
                            <div className="relative h-36 bg-warm-cream overflow-hidden">
                                <img
                                    src={car.imageUrl || 'https://via.placeholder.com/400x200'}
                                    alt={`${car.make} ${car.model}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Клас */}
                                <span className="absolute top-2 left-2 bg-white/90 text-warm-ink text-xs font-medium px-2 py-0.5 rounded-full border border-warm-border">
                                    {car.class}
                                </span>
                                {/* Рейтинг */}
                                {car.rating > 0 && (
                                    <span className="absolute top-2 right-2 bg-white/90 text-warm-ink text-xs font-medium px-2 py-0.5 rounded-full border border-warm-border">
                                        ★ {car.rating.toFixed(1)}
                                    </span>
                                )}
                            </div>

                            {/* Тіло картки */}
                            <div className="p-4">
                                <p className="font-medium text-warm-ink">
                                    {car.make} {car.model}
                                </p>
                                <p className="text-xs text-warm-muted mt-0.5">
                                    {car.year} · {car.transmission} · {car.fuel}
                                </p>

                                {/* Пояснення від ШІ */}
                                {isAi && (
                                    <div className="mt-3 flex items-start gap-2 bg-brand-light/40 border border-brand-light rounded-lg px-3 py-2">
                                        <span className="text-brand-primary mt-0.5 shrink-0 text-sm">✦</span>
                                        <p className="text-xs text-warm-ink leading-relaxed">{reason}</p>
                                    </div>
                                )}

                                {/* Ціна */}
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-warm-muted">{car.location}</p>
                                    <p className="text-brand-primary font-medium text-sm">
                                        ${car.pricePerDay}<span className="text-warm-muted font-normal">/день</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};