import { useNavigate } from 'react-router-dom';
import type { CarResponseDto } from '@/entities/car/model/types';

interface Props {
    car: CarResponseDto;
}

export const P2pCarCard = ({ car }: Props) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-warm-border rounded-lg overflow-hidden hover:border-warm-muted transition-colors">
            {/* Фото */}
            <div className="relative h-44 bg-brand-light">
                <img
                    src={car.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-contain"
                />
                <span className="absolute top-3 left-3 bg-warm-ink text-warm-cream text-xs px-3 py-1 rounded-full font-medium">
                    P2P
                </span>
                {car.rating > 0 && (
                    <span className="absolute top-3 right-3 bg-white/90 text-warm-ink text-xs px-2 py-1 rounded-full border border-warm-border">
                        ★ {car.rating.toFixed(1)}
                    </span>
                )}
            </div>

            {/* Тіло */}
            <div className="p-4">
                <p className="font-medium text-warm-ink text-sm">
                    {car.make} {car.model}
                </p>
                <p className="text-xs text-warm-muted mt-1">
                    {car.transmission} · {car.year} · {car.location}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-brand-primary font-medium text-base">
                            ${car.pricePerDay}
                        </span>
                        <span className="text-warm-muted text-xs"> / день</span>
                    </div>
                    <button
                        onClick={() => navigate(`/cars/${car.id}`)}
                        className="bg-brand-light text-brand-primary text-xs font-medium px-3 py-2 rounded-md hover:bg-brand-primary hover:text-white transition-colors"
                    >
                        Контакти
                    </button>
                </div>
            </div>
        </div>
    );
};