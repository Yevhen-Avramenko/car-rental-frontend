import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getRecommendations,
    getCarsByIds,
    type RecommendationItem,
    type UserPreferenceProfile,
} from '../../api/recommendationService';
import type { CarResponseDto } from '@/entities/car/model/types';

const SkeletonCard = () => (
    <div className="bg-white border border-warm-border rounded-xl overflow-hidden animate-pulse">
        <div className="h-36 bg-warm-cream" />
        <div className="p-4 space-y-2">
            <div className="h-4 bg-warm-cream rounded w-3/4" />
            <div className="h-3 bg-warm-cream rounded w-1/2" />
            <div className="h-10 bg-warm-cream rounded w-full mt-3" />
        </div>
    </div>
);

interface EnrichedRec {
    car: CarResponseDto;
    reason: string;
}

interface AIRecommendationsProps {
    compact?: boolean;
}

export const AIRecommendations = ({ compact = false }: AIRecommendationsProps) => {
    const navigate  = useNavigate();
    const [recs,    setRecs]    = useState<EnrichedRec[]>([]);
    const [isAi,    setIsAi]    = useState(false);
    const [profile, setProfile] = useState<UserPreferenceProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getRecommendations();
                const cars = await getCarsByIds(data.recommendations.map(r => r.carId));

                const enriched: EnrichedRec[] = data.recommendations
                    .map((rec: RecommendationItem) => {
                        const car = cars.find(c => c.id === rec.carId);
                        return car ? { car, reason: rec.reason } : null;
                    })
                    .filter(Boolean) as EnrichedRec[];

                setRecs(enriched);
                setIsAi(data.isAiGenerated);
                setProfile(data.userProfile ?? null);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (error) return null;

    return (
        <section className={compact ? 'mt-10' : 'max-w-6xl mx-auto px-6 pb-14'}>

            {/* ── Заголовок ── */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* AI badge */}
                {isAi ? (
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L9.19 8.63L2 9.24L7 13.97L5.36 21L12 17.27L18.64 21L17 13.97L22 9.24L14.81 8.63L12 2Z"/>
                        </svg>
                        ШІ-підбір
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 bg-warm-cream border border-warm-border text-warm-muted text-xs font-medium px-3 py-1 rounded-full">
                        ★ Популярне
                    </span>
                )}

                <h2 className="text-xl font-medium text-warm-ink">
                    {isAi ? 'Підібрано саме для вас' : 'Топ авто тижня'}
                </h2>
            </div>

            {/* ── Профіль вподобань (тільки для AI) ── */}
            {isAi && profile && !loading && (
                <div className="mb-5 bg-gradient-to-r from-amber-50/60 to-orange-50/40 border border-amber-100 rounded-xl px-4 py-3 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-xs text-warm-muted">
                        <span className="text-amber-600">✦</span>
                        <span>На основі <strong className="text-warm-ink">{profile.totalRentals} оренд</strong></span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: 'Клас',  value: profile.preferredClass },
                            { label: 'Пальне', value: profile.preferredFuel },
                            { label: 'КПП',   value: profile.preferredTransmission },
                            { label: 'Бюджет', value: `~$${profile.avgBudgetPerDay}/день` },
                        ].map(({ label, value }) => (
                            <span key={label} className="bg-white border border-amber-100 text-warm-ink text-xs px-2.5 py-1 rounded-full">
                                <span className="text-warm-muted">{label}:</span> <strong>{value}</strong>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Картки ── */}
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
                                <span className="absolute top-2 left-2 bg-white/90 text-warm-ink text-xs font-medium px-2 py-0.5 rounded-full border border-warm-border">
                                    {car.class}
                                </span>
                                {car.rating > 0 && (
                                    <span className="absolute top-2 right-2 bg-white/90 text-warm-ink text-xs font-medium px-2 py-0.5 rounded-full border border-warm-border">
                                        ★ {car.rating.toFixed(1)}
                                    </span>
                                )}
                                {/* AI мітка на фото */}
                                {isAi && (
                                    <span className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        ✦ ШІ-вибір
                                    </span>
                                )}
                            </div>

                            <div className="p-4">
                                <p className="font-medium text-warm-ink">{car.make} {car.model}</p>
                                <p className="text-xs text-warm-muted mt-0.5">
                                    {car.year} · {car.transmission} · {car.fuel}
                                </p>

                                {/* Пояснення від ШІ */}
                                {isAi && (
                                    <div className="mt-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg px-3 py-2 flex gap-2 items-start">
                                        <span className="text-amber-500 text-sm shrink-0 mt-0.5">✦</span>
                                        <p className="text-xs text-warm-ink leading-relaxed">{reason}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-warm-muted">{car.location}</p>
                                    <p className="text-brand-primary font-medium text-sm">
                                        ${car.pricePerDay}
                                        <span className="text-warm-muted font-normal">/день</span>
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