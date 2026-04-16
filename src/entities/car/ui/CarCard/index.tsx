import React from 'react';
import type{ CarResponseDto } from '../../model/types';
import { useNavigate } from 'react-router-dom';

interface CarCardProps {
    car: CarResponseDto;
    onRent?: (id: number) => void;
}

const transmissionLabels: Record<string, string> = {
    Automatic: 'Автомат',
    Manual: 'Механіка',
};

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();
  
    return (
        <div className="bg-white border border-warm-border rounded-lg overflow-hidden hover:border-warm-muted transition-colors">
            
            {/* Зображення */}
            <div className="relative h-44 bg-brand-light">
                <img
                    src={car.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                />
                {/* Бейдж класу */}
                <span className="absolute top-3 left-3 bg-warm-ink text-warm-cream text-xs px-3 py-1 rounded-full font-medium">
                    {car.class}
                </span>
            </div>

            {/* Тіло картки */}
            <div className="p-4 flex flex-col h-[calc(100%-11rem)]">
                <p className="font-medium text-warm-ink text-sm mb-1">
                    {car.make} {car.model}
                </p>
                <p className="text-xs text-warm-muted mb-4">
                    {transmissionLabels[car.transmission] || car.transmission} · {car.year} · {car.location}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-brand-primary font-medium text-base">
                            ${car.pricePerDay}
                        </span>
                        <span className="text-warm-muted text-xs"> / день</span>
                    </div>

                    <button
                        onClick={() => navigate(`/cars/${car.id}`)}
                        disabled={!car.isAvailable}
                        className="bg-brand-light text-brand-primary text-xs font-medium px-3 py-2 rounded-md hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {car.isAvailable ? 'Детальніше' : 'Недоступно'}
                    </button>
                </div>
            </div>
        </div>
    );
};