import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/model/useAuth';
import { getMyRentals, cancelRental, addReview } from '@/features/profile/api/profileService';
import { type RentalResponseDto } from '@/entities/rental/model/types';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';
import { AIRecommendations } from '@/features/recommendations/ui/AIRecommendations';


// Допоміжна функція для кольорів статусів
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">Очікує</span>;
        case 'Active': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Активна</span>;
        case 'Completed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Завершена</span>;
        case 'Cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Скасована</span>;
        case 'Rejected': return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Відхилена</span>;
        default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
};

export const ProfilePage = () => {
    const { user } = useAuth();
    const [rentals, setRentals] = useState<RentalResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Стан для форми відгуку
    const [reviewingCarId, setReviewingCarId] = useState<number | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchRentals = async () => {
        try {
            const data = await getMyRentals();
            setRentals(data);
        } catch  {
            setError('Не вдалося завантажити історію бронювань.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const handleCancel = async (id: number) => {
        if (!window.confirm('Ви впевнені, що хочете скасувати це бронювання?')) return;
        try {
            await cancelRental(id);
            await fetchRentals(); // Оновлюємо список
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.message || 'Помилка при скасуванні.');
            } else {
                alert('Сталася невідома помилка.');
            }
        }
    };

    const handleReviewSubmit = async (carId: number) => {
        try {
            await addReview({ carId, rating, comment });
            alert('Дякуємо за ваш відгук!');
            setReviewingCarId(null);
            setComment('');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.message || 'Помилка при відправці відгуку.');
            } else {
                alert('Сталася невідома помилка.');
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-warm-muted">Завантаження...</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-medium text-warm-ink mb-2">Особистий кабінет</h1>
            <p className="text-warm-muted mb-10">Привіт, {user?.firstName}! Тут знаходиться ваша історія бронювань.</p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="space-y-6">
                {rentals.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl border border-warm-border text-center">
                        <p className="text-warm-muted mb-4">У вас ще немає бронювань.</p>
                        <Button onClick={() => window.location.href = '/catalog'}>Перейти до каталогу</Button>
                    </div>
                ) : (
                    rentals.map((rental) => (
                        <div key={rental.id} className="bg-white p-6 rounded-xl border border-warm-border shadow-sm flex flex-col md:flex-row gap-6">
                            {/* Фото авто */}
                            <div className="w-full md:w-48 h-32 bg-brand-light rounded-lg overflow-hidden shrink-0">
                                <img src={rental.carImageUrl || 'https://via.placeholder.com/300x200'} alt={rental.carMake} className="w-full h-full object-cover" />
                            </div>

                            {/* Деталі */}
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-medium text-warm-ink">{rental.carMake} {rental.carModel}</h3>
                                    {getStatusBadge(rental.status)}
                                </div>
                                <p className="text-sm text-warm-muted mb-1">Замовлення #{rental.id} від {new Date(rental.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm font-medium text-warm-ink mb-4">
                                    {new Date(rental.startDate).toLocaleDateString()} — {new Date(rental.endDate).toLocaleDateString()}
                                </p>
                                
                                <div className="flex justify-between items-end mt-auto">
                                    <p className="text-brand-primary font-medium">Сума: ${rental.totalPrice}</p>
                                    
                                    {/* Кнопки дій */}
                                    <div className="flex gap-2">
                                        {(rental.status === 'Pending' || rental.status === 'Active') && (
                                            <button onClick={() => handleCancel(rental.id)} className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition">
                                                Скасувати
                                            </button>
                                        )}
                                        {rental.status === 'Completed' && reviewingCarId !== rental.carId && (
                                            <button onClick={() => setReviewingCarId(rental.carId)} className="text-sm text-brand-primary hover:text-brand-dark font-medium px-3 py-1 border border-brand-light rounded-md hover:bg-brand-light/50 transition">
                                                Залишити відгук
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Форма відгуку (відкривається при кліку) */}
                                {reviewingCarId === rental.carId && (
                                    <div className="mt-4 p-4 bg-warm-cream rounded-lg border border-warm-border">
                                        <h4 className="text-sm font-medium text-warm-ink mb-2">Оцініть оренду</h4>
                                        <select className="mb-2 w-full p-2 text-sm border border-warm-border rounded-md" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                            <option value="5">⭐⭐⭐⭐⭐ Відмінно</option>
                                            <option value="4">⭐⭐⭐⭐ Добре</option>
                                            <option value="3">⭐⭐⭐ Нормально</option>
                                            <option value="2">⭐⭐ Погано</option>
                                            <option value="1">⭐ Жахливо</option>
                                        </select>
                                        <textarea 
                                            className="w-full p-2 text-sm border border-warm-border rounded-md mb-2" 
                                            rows={2} placeholder="Що вам сподобалось або не сподобалось?"
                                            value={comment} onChange={(e) => setComment(e.target.value)}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setReviewingCarId(null)} className="text-xs text-warm-muted hover:text-warm-ink px-3 py-2">Скасувати</button>
                                            <Button className="py-2 text-xs" onClick={() => handleReviewSubmit(rental.carId)}>Відправити</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <AIRecommendations compact />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};