import { useState } from 'react';
import { Button } from '@/shared/ui/Button';

export interface SearchParams {
    city: string;
    dateFrom: string;
    dateTo: string;
}

interface SearchBarProps {
    onSearch: (params: SearchParams) => void;
}
export const SearchBar = ({ onSearch }: SearchBarProps) => {
    
    const [city, setCity] = useState('Київ');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const handleSubmit = () => {
        onSearch({ city, dateFrom, dateTo });
    };

    return (
        <div className="flex flex-col md:flex-row items-stretch bg-white border border-warm-border rounded-xl overflow-hidden">
            
            {/* Поле: Місто */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-warm-border px-4 py-3">
                <p className="text-xs text-warm-muted mb-1">Місто оренди</p>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm text-warm-ink bg-transparent outline-none placeholder:text-warm-muted"
                    placeholder="Введіть місто..."
                />
            </div>

            {/* Поле: Від */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-warm-border px-4 py-3">
                <p className="text-xs text-warm-muted mb-1">Дата початку</p>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full text-sm text-warm-ink bg-transparent outline-none"
                />
            </div>

            {/* Поле: До */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-warm-border px-4 py-3">
                <p className="text-xs text-warm-muted mb-1">Дата завершення</p>
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full text-sm text-warm-ink bg-transparent outline-none"
                />
            </div>

            {/* Кнопка пошуку */}
            <Button 
                onClick={handleSubmit} 
                className="md:rounded-none md:rounded-r-xl whitespace-nowrap"
            >
                Знайти авто
            </Button>
            
        </div>
    );
};