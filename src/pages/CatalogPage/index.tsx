import { useState, useCallback } from 'react';
import { CatalogWidget } from '@/widgets/CatalogWidget';
import { CatalogSidebar } from '@/features/car-catalog/ui/CatalogSidebar';
import type { CarFilterParams } from '@/entities/car/api/carService';

export const CatalogPage = () => {
    const [filters, setFilters] = useState<CarFilterParams>({});

    
    const handleFilterChange = useCallback((newFilters: CarFilterParams) => {
        setFilters(newFilters);
    }, []);

    return (
        <div className="min-h-screen bg-warm-cream">
            <section className="max-w-6xl mx-auto px-6 pt-14 pb-16">

                {/* Заголовок */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span className="text-xs text-brand-primary font-medium">Наш автопарк</span>
                </div>
                <h1 className="text-4xl font-medium text-warm-ink leading-tight mb-2">
                    Каталог автомобілів
                </h1>
                <p className="text-warm-muted text-base mb-8 max-w-lg">
                    Обирайте найкраще авто для вашої подорожі.
                </p>

                
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <CatalogSidebar onFilterChange={handleFilterChange} />
                    <div className="flex-1 min-w-0">
                        <CatalogWidget filters={filters} />
                    </div>
                </div>

            </section>
        </div>
    );
};