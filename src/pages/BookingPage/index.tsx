import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById } from '@/entities/car/api/carService';
import { type CarDetailDto } from '@/entities/car/model/types';
import { BookingForm } from '@/features/booking/ui/BookingForm';
import { BookingSuccess } from '@/features/booking/ui/BookingSuccess';
import { type RentalResponseDto } from '@/features/booking/api/bookingService';

export const BookingPage = () => {
    const { carId } = useParams<{ carId: string }>();
    const navigate = useNavigate();
    
    const [car, setCar] = useState<CarDetailDto | null>(null);
    const [bookingResult, setBookingResult] = useState<RentalResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!carId) return;
        getCarById(Number(carId))
            .then(setCar)
            .catch(() => navigate('/catalog')) // Якщо авто немає - викидаємо в каталог
            .finally(() => setLoading(false));
    }, [carId, navigate]);

    if (loading) return <div className="text-center py-20 text-warm-muted">Завантаження...</div>;
    if (!car) return null;

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            {!bookingResult ? (
                <>
                    <h1 className="text-3xl font-medium text-warm-ink mb-2">Оренда {car.make} {car.model}</h1>
                    <p className="text-warm-muted mb-8">{car.address}</p>
                    <BookingForm 
                        carId={car.id} 
                        pricePerDay={car.pricePerDay} 
                        onSuccess={setBookingResult} 
                    />
                </>
            ) : (
                <BookingSuccess rental={bookingResult} />
            )}
        </div>
    );
};