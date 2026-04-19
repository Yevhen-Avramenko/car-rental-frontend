import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/useAuth';
import { createRental, type CreateRentalDto } from '../../api/bookingService';
import { getBookedDates, type BookedPeriod } from '@/entities/car/api/carService';
import type { RentalResponseDto } from '@/entities/rental/model/types';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';
import { createPaymentForm, redirectToWayForPay } from '@/features/payment/api/paymentService';

interface BookingFormProps {
    carId: number;
    pricePerDay: number;
    onSuccess: (rental: RentalResponseDto) => void;
}

// Перевірка чи дата потрапляє хоча б в один зайнятий діапазон
const isDateBooked = (date: string, periods: BookedPeriod[]): boolean => {
    const d = new Date(date);
    return periods.some(p => {
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        return d >= start && d <= end;
    });
};

// Перевірка чи обраний діапазон перетинається з будь-яким зайнятим
const rangeOverlapsBooked = (start: string, end: string, periods: BookedPeriod[]): boolean => {
    const s = new Date(start);
    const e = new Date(end);
    return periods.some(p => {
        const ps = new Date(p.startDate);
        const pe = new Date(p.endDate);
        return s <= pe && e >= ps;
    });
};

export const BookingForm = ({ carId, pricePerDay, onSuccess }: BookingFormProps) => {
    const { isAuth, user } = useAuth();
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Зайняті діапазони
    const [bookedPeriods, setBookedPeriods] = useState<BookedPeriod[]>([]);

    useEffect(() => {
        getBookedDates(carId).then(setBookedPeriods).catch(() => {});
    }, [carId]);

    const { days, totalPrice } = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        let calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (calculatedDays < 1) calculatedDays = 1;
        return { days: calculatedDays, totalPrice: calculatedDays * pricePerDay };
    }, [startDate, endDate, pricePerDay]);

    // Перша доступна дата від сьогодні
    const firstAvailableDate = useMemo(() => {
        const date = new Date();
        for (let i = 0; i < 365; i++) {
            const str = date.toISOString().split('T')[0];
            if (!isDateBooked(str, bookedPeriods)) return str;
            date.setDate(date.getDate() + 1);
        }
        return today;
    }, [bookedPeriods]);

    const handleStartDateChange = (val: string) => {
        if (isDateBooked(val, bookedPeriods)) {
            setError('Ця дата вже зайнята. Оберіть іншу.');
            return;
        }
        setError('');
        setStartDate(val);
        if (endDate < val) setEndDate(val);
    };

    const handleEndDateChange = (val: string) => {
        if (isDateBooked(val, bookedPeriods)) {
            setError('Дата повернення вже зайнята. Оберіть іншу.');
            return;
        }
        if (rangeOverlapsBooked(startDate, val, bookedPeriods)) {
            setError('Обраний діапазон перетинається із зайнятими датами.');
            return;
        }
        setError('');
        setEndDate(val);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rangeOverlapsBooked(startDate, endDate, bookedPeriods)) {
            setError('Авто вже зайняте на обрані дати.');
            return;
        }

        setIsLoading(true);
        const dto: CreateRentalDto = { carId, startDate, endDate };
        if (!isAuth) {
            dto.guestFirstName = firstName;
            dto.guestLastName = lastName;
            dto.guestEmail = email;
            dto.guestPhone = phone;
        }

        try {
            const rental = await createRental(dto);

            // Отримуємо форму оплати і редіректимо на WayForPay
            const formData = await createPaymentForm(
                rental.id,
                isAuth ? user?.email : email || undefined
            );
            redirectToWayForPay(formData);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Помилка при бронюванні.');
            } else {
                setError('Сталася невідома помилка.');
            }
            setIsLoading(false); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-warm-border shadow-sm">
            <h3 className="text-xl font-medium text-warm-ink mb-6">Оформлення оренди</h3>

            {isAuth ? (
                <div className="bg-warm-cream p-4 rounded-lg mb-6 border border-brand-light">
                    <p className="text-sm text-warm-ink">Ви бронюєте як <span className="font-medium">{user?.firstName}</span>.</p>
                    <p className="text-xs text-warm-muted mt-1">Ваші дані підтягнуться автоматично.</p>
                </div>
            ) : (
                <div className="space-y-4 mb-6">
                    <div className="bg-brand-light/30 p-4 rounded-lg text-sm text-warm-ink border border-brand-light mb-4">
                        💡 <Link to="/register" className="text-brand-primary font-medium hover:underline">Зареєструйтесь</Link>, щоб бачити історію бронювань.
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

            {/* Зайняті діапазони — підказка */}
            {bookedPeriods.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700 font-medium mb-1">Зайняті дати:</p>
                    {bookedPeriods.map((p, i) => (
                        <p key={i} className="text-xs text-yellow-600">
                            {new Date(p.startDate).toLocaleDateString('uk-UA')} — {new Date(p.endDate).toLocaleDateString('uk-UA')}
                        </p>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs text-warm-muted mb-1">Отримання</label>
                    <input
                        type="date" required
                        min={firstAvailableDate}
                        value={startDate}
                        onChange={e => handleStartDateChange(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-warm-border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-xs text-warm-muted mb-1">Повернення</label>
                    <input
                        type="date" required
                        min={startDate}
                        value={endDate}
                        onChange={e => handleEndDateChange(e.target.value)}
                        className="w-full px-4 py-2 text-sm border border-warm-border rounded-md"
                    />
                </div>
            </div>

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