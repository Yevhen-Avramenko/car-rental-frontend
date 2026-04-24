import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById } from '@/entities/car/api/carService';
import { type CarDetailDto } from '@/entities/car/model/types';
import { Button } from '@/shared/ui/Button';
import { LocationMap } from '@/shared/ui/LocationMap';
import { ImageGallery } from '@/shared/ui/ImageGallery';
import { useAuth } from '@/features/auth/model/useAuth';

export const CarDetailPage = () => {
    const { id } = useParams<{ id: string }>(); // Дістаємо ID з URL
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    const [car, setCar] = useState<CarDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCar = async () => {
            if (!id) return;
            try {
                const data = await getCarById(Number(id));
                setCar(data);
            } catch {
                setError('Автомобіль не знайдено або сталася помилка.');
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-warm-muted">Завантаження... ⏳</div>;
    if (error || !car) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Кнопка назад */}
            <button onClick={() => navigate(-1)} className="text-sm text-warm-muted hover:text-warm-ink mb-6 flex items-center gap-2">
                ← Назад до каталогу
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Ліва колонка: Галерея */}
               <div>
                    <ImageGallery
                        images={car.images ?? [car.imageUrl].filter(Boolean)}
                        alt={`${car.make} ${car.model}`}
                    />
                </div>

                {/* Права колонка: Інфо */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-medium text-warm-ink">{car.make} {car.model}</h1>
                            <span className="text-2xl font-medium text-brand-primary">{car.pricePerDay}$<span className="text-sm text-warm-muted">/день</span></span>
                        </div>
                        <p className="text-sm text-warm-muted mt-1">{car.address}</p>
                    </div>

                    <p className="text-warm-ink leading-relaxed">{car.description}</p>

                    {/* Характеристики */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-warm-border">
                        <div>
                            <p className="text-xs text-warm-muted">Клас</p>
                            <p className="font-medium text-warm-ink">{car.class}</p>
                        </div>
                        <div>
                            <p className="text-xs text-warm-muted">Кількість місць</p>
                            <p className="font-medium text-warm-ink">{car.numberOfSeats}</p>
                        </div>
                        <div>
                            <p className="text-xs text-warm-muted">Об'єм двигуна</p>
                            <p className="font-medium text-warm-ink">{car.engineVolume} л</p>
                        </div>
                    </div>

                    {car.ownerRole === 'Client' ? (
                        <div className="bg-warm-cream border border-warm-border rounded-xl p-5 mt-6">
                            <p className="text-xs text-warm-muted uppercase tracking-wide mb-3 font-medium">
                                Власник авто
                            </p>
                            <p className="font-medium text-warm-ink mb-4">{car.ownerName}</p>
                            <div className="space-y-2">
                                {car.ownerPhone && (
                                    <a href={`tel:${car.ownerPhone}`}
                                    className="flex items-center gap-3 bg-white border border-warm-border rounded-lg px-4 py-3 hover:bg-brand-light/20 transition text-sm text-warm-ink">
                                        📞 {car.ownerPhone}
                                    </a>
                                )}
                                {car.ownerEmail && (
                                    <a href={`mailto:${car.ownerEmail}`}
                                    className="flex items-center gap-3 bg-white border border-warm-border rounded-lg px-4 py-3 hover:bg-brand-light/20 transition text-sm text-warm-ink">
                                        ✉️ {car.ownerEmail}
                                    </a>
                                )}
                            </div>
                            <p className="text-xs text-warm-muted mt-4 text-center">
                                Оплата та умови — напряму з власником
                            </p>
                        </div>
                    ) : (
                        <Button onClick={() => navigate(`/booking/${car.id}`)}>
                            Забронювати
                        </Button>
                    )}
                </div>
            </div>
            {car.address && car.address !== 'Unknown' && (
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-warm-ink mb-1">
                        Місце отримання авто
                    </h2>
                    <p className="text-sm text-warm-muted mb-3">{car.address}</p>
                    <LocationMap address={car.address} />
                </div>
            )}
            {/* Секція відгуків */}
            <div className="mt-16">
                <h2 className="text-2xl font-medium text-warm-ink mb-6">Відгуки клієнтів</h2>
                {car.reviews && car.reviews.length > 0 ? (
                    <div className="space-y-4">
                        {car.reviews.map((review, index) => (
                            <div key={index} className="bg-white p-5 rounded-xl border border-warm-border">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-warm-ink">{review.userName}</span>
                                    <span className="text-brand-primary">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                </div>
                                <p className="text-warm-muted">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-warm-muted">Поки що немає відгуків. Будьте першим!</p>
                )}
            </div>
        </div>
    );
};