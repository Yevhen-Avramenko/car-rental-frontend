import { useState, useEffect } from 'react';
import { api } from '@/shared/api/axiosConfig';
import { CarCard } from '@/entities/car/ui/CarCard';
import type { CarResponseDto } from '@/entities/car/model/types';


interface CatalogWidgetProps {
    category?: string; // Робимо необов'язковим, щоб старий код не зламався
}

export const CatalogWidget = ({ category = 'all' }: CatalogWidgetProps) => {
    const [cars, setCars] = useState<CarResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get<CarResponseDto[]>('/Cars');
                setCars(response.data);
            } catch (err) {
                console.error(err);
                setError('Не вдалося завантажити автомобілі з сервера.');
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) return <div className="text-center py-20 text-warm-muted">Завантаження каталогу... ⏳</div>;
    if (error) return <div className="text-center py-20 text-brand-primary font-medium">{error}</div>;

    
    const displayedCars = category === 'all' 
        ? cars 
        : cars.filter(car => car.class === category);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            
            {displayedCars.length > 0 ? (
                displayedCars.map((car) => (
                    <CarCard 
                        key={car.id} 
                        car={car} 
                        onRent={(id) => console.log('Оренда авто:', id)} 
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-warm-muted">
                    Автомобілів у цій категорії поки немає 
                </div>
            )}
        </div>
    );
};