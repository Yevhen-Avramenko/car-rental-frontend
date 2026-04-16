import { useState, useEffect } from 'react';
import { getAllCars, type CarFilterParams } from '@/entities/car/api/carService';

import { CarCard } from '@/entities/car/ui/CarCard';
import type { CarResponseDto } from '@/entities/car/model/types';


interface CatalogWidgetProps {
    filters?: CarFilterParams;
}

export const CatalogWidget = ({ filters }: CatalogWidgetProps) => {
    const [cars, setCars] = useState<CarResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            setError(null); // Скидаємо помилку перед новим запитом
            try {
                // Відправляємо фільтри на бекенд. Бекенд сам все відфільтрує!
                const data = await getAllCars(filters);
                setCars(data);
            } catch (err) {
                console.error(err);
                setError('Не вдалося завантажити автомобілі з сервера.');
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [filters]); // <--- Важливо: useEffect запуститься знову, якщо фільтри зміняться

    if (loading) return <div className="text-center py-20 text-warm-muted">Завантаження каталогу... ⏳</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-medium">{error}</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {cars.length > 0 ? (
                
                cars.map((car) => (
                    <CarCard 
                        key={car.id} 
                        car={car} 
                        
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-warm-muted">
                    За вашим запитом авто не знайдено 🕵️‍♂️ Спробуйте змінити фільтри.
                </div>
            )}
        </div>
    );
};