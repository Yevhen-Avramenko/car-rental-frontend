import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/useAuth';
import { createRental, type CreateRentalDto, type RentalResponseDto } from '../../api/bookingService';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';

interface BookingFormProps {
    carId: number;
    pricePerDay: number;
    onSuccess: (rental: RentalResponseDto) => void;
}

export const BookingForm = ({ carId, pricePerDay, onSuccess }: BookingFormProps) => {
    const { isAuth, user } = useAuth();
    const navigate = useNavigate();

    // Дати (за замовчуванням startDate = сьогодні)
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    // Гостьові поля
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Розумний розрахунок днів і суми
    const { days, totalPrice } = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        let calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (calculatedDays < 1) calculatedDays = 1; // Мінімум 1 день
        
        return {
            days: calculatedDays,
            totalPrice: calculatedDays * pricePerDay
        };
    }, [startDate, endDate, pricePerDay]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const dto: CreateRentalDto = { carId, startDate, endDate };

        if (!isAuth) {
            dto.guestFirstName = firstName;
            dto.guestLastName = lastName;
            dto.guestEmail = email;
            dto.guestPhone = phone;
        }

        try {
            const result = await createRental(dto);
            if (isAuth) {
                navigate('/profile'); // Авторизованих одразу в кабінет
            } else {
                onSuccess(result); // Гостям показуємо компонент успіху
            }
        } catch (err) {
           
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Помилка при бронюванні. Можливо, авто вже зайняте.');
            } else {
                
                setError('Сталася невідома помилка при оформленні.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-warm-border shadow-sm">
            <h3 className="text-xl font-medium text-warm-ink mb-6">Оформлення оренди</h3>

            {/* Блок для Авторизованого / Гостя */}
            {isAuth ? (
                <div className="bg-warm-cream p-4 rounded-lg mb-6 border border-brand-light">
                    <p className="text-sm text-warm-ink">Ви бронюєте як <span className="font-medium">{user?.firstName}</span>.</p>
                    <p className="text-xs text-warm-muted mt-1">Ваші дані підтягнуться автоматично.</p>
                </div>
            ) : (
                <div className="space-y-4 mb-6">
                    <div className="bg-brand-light/30 p-4 rounded-lg text-sm text-warm-ink border border-brand-light mb-4">
                        💡 Бронюєте вперше? Ви можете оформити замовлення як гість, але <Link to="/register" className="text-brand-primary font-medium hover:underline">реєстрація</Link> дозволить бачити історію.
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Ім'я" required value={firstName} onChange={e => setFirstName(e.target.value)} className="px-4 py-2 text-sm border border-warm-border rounded-md" />
                        <input type="text" placeholder="Прізвище" required value={lastName} onChange={e => setLastName(e.target.value)} className="px-4 py-2 text-sm border border-warm-border rounded-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="px-4 py-2 text-sm border border-warm-border rounded-md" />
                        <input type="tel" placeholder="Телефон" required value={phone} onChange={e => setPhone(e.target.value)} className="px-4 py-2 text-sm border border-warm-border rounded-md" />
                    </div>
                </div>
            )}

            {/* Дати */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs text-warm-muted mb-1">Отримання</label>
                    <input type="date" required min={today} value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-2 text-sm border border-warm-border rounded-md" />
                </div>
                <div>
                    <label className="block text-xs text-warm-muted mb-1">Повернення</label>
                    <input type="date" required min={startDate} value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-2 text-sm border border-warm-border rounded-md" />
                </div>
            </div>

            {/* Підсумок */}
            <div className="border-t border-warm-border pt-4 mb-6 flex justify-between items-end">
                <div>
                    <p className="text-sm text-warm-muted">Тривалість: {days} дн.</p>
                    <p className="text-sm text-warm-muted">Ціна за день: ${pricePerDay}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-warm-muted mb-1">До сплати</p>
                    <p className="text-2xl font-medium text-brand-primary">${totalPrice}</p>
                </div>
            </div>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <Button type="submit" className="w-full py-3" disabled={isLoading}>
                {isLoading ? 'Оформлення...' : 'Підтвердити бронювання'}
            </Button>
        </form>
    );
};