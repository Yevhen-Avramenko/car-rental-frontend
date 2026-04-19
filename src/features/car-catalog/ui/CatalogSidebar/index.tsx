import { useState, useEffect, useCallback } from 'react';
import type { CarFilterParams } from '@/entities/car/api/carService';

interface CatalogSidebarProps {
    onFilterChange: (filters: CarFilterParams) => void;
}

const currentYear = new Date().getFullYear();


const classOptions = [
    { value: '', label: 'Будь-який' },
    { value: 'Economy', label: 'Економ' },
    { value: 'Comfort', label: 'Комфорт' },
    { value: 'Business', label: 'Бізнес' },
    { value: 'SUV', label: 'Позашляховик' },
    { value: 'Minivan', label: 'Мінівен' },
];

const transmissionOptions = [
    { value: '', label: 'Будь-яка' },
    { value: 'Automatic', label: 'Автомат' },
    { value: 'Manual', label: 'Механіка' },
    { value: 'Robot', label: 'Робот' },
];

const fuelOptions = [
    { value: '', label: 'Будь-яке' },
    { value: 'Petrol', label: 'Бензин' },
    { value: 'Diesel', label: 'Дизель' },
    { value: 'Electric', label: 'Електро' },
    { value: 'Hybrid', label: 'Гібрид' },
];

const seatsOptions = [
    { value: '', label: 'Будь-яка' },
    { value: '2', label: '2+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
    { value: '7', label: '7+' },
];

export const CatalogSidebar = ({ onFilterChange }: CatalogSidebarProps) => {
    const today = new Date().toISOString().split('T')[0];

    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [carClass, setCarClass] = useState('');
    const [transmission, setTransmission] = useState('');
    const [fuel, setFuel] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [minSeats, setMinSeats] = useState('');

   
    const buildAndEmit = useCallback(() => {
        const filters: CarFilterParams = {};
        if (city.trim())       filters.city = city.trim();
        if (startDate)         filters.startDate = startDate;
        if (endDate)           filters.endDate = endDate;
        if (carClass)          filters.class = carClass;
        if (transmission)      filters.transmission = transmission;
        if (fuel)              filters.fuel = fuel;
        if (minPrice)          filters.minPrice = Number(minPrice);
        if (maxPrice)          filters.maxPrice = Number(maxPrice);
        if (minYear)           filters.minYear = Number(minYear);
        if (maxYear)           filters.maxYear = Number(maxYear);
        if (minSeats)          filters.minSeats = Number(minSeats);
        onFilterChange(filters);
    }, [city, startDate, endDate, carClass, transmission, fuel,
        minPrice, maxPrice, minYear, maxYear, minSeats, onFilterChange]);

    useEffect(() => {
        const timer = setTimeout(buildAndEmit, 400);
        return () => clearTimeout(timer);
    }, [buildAndEmit]);

    const handleReset = () => {
        setCity(''); setStartDate(''); setEndDate('');
        setCarClass(''); setTransmission(''); setFuel('');
        setMinPrice(''); setMaxPrice('');
        setMinYear(''); setMaxYear(''); setMinSeats('');
        onFilterChange({});
    };

    
    const labelCls = 'block text-xs text-warm-muted mb-1';
    const inputCls = 'w-full px-3 py-2 text-sm border border-warm-border rounded-lg outline-none focus:border-brand-primary bg-white';
    const selectCls = inputCls;

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white border border-warm-border rounded-xl p-5 sticky top-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-medium text-warm-ink">Фільтри</h2>
                    <button
                        onClick={handleReset}
                        className="text-xs text-brand-primary hover:underline"
                    >
                        Скинути
                    </button>
                </div>

                <div className="space-y-4">

                    {/* Місто */}
                    <div>
                        <label className={labelCls}>Місто</label>
                        <input
                            type="text"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            placeholder="Київ, Львів..."
                            className={inputCls}
                        />
                    </div>

                    {/* Дати */}
                    <div>
                        <label className={labelCls}>Дата початку</label>
                        <input
                            type="date" min={today}
                            value={startDate}
                            onChange={e => { setStartDate(e.target.value); if (endDate < e.target.value) setEndDate(''); }}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Дата завершення</label>
                        <input
                            type="date" min={startDate || today}
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className={inputCls}
                        />
                    </div>

                    <hr className="border-warm-border" />

                    {/* Клас */}
                    <div>
                        <label className={labelCls}>Клас авто</label>
                        <select value={carClass} onChange={e => setCarClass(e.target.value)} className={selectCls}>
                            {classOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>

                    {/* КПП */}
                    <div>
                        <label className={labelCls}>Коробка передач</label>
                        <select value={transmission} onChange={e => setTransmission(e.target.value)} className={selectCls}>
                            {transmissionOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>

                    {/* Паливо */}
                    <div>
                        <label className={labelCls}>Тип палива</label>
                        <select value={fuel} onChange={e => setFuel(e.target.value)} className={selectCls}>
                            {fuelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>

                    {/* Кількість місць */}
                    <div>
                        <label className={labelCls}>Мінімум місць</label>
                        <select value={minSeats} onChange={e => setMinSeats(e.target.value)} className={selectCls}>
                            {seatsOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>

                    <hr className="border-warm-border" />

                    {/* Ціна */}
                    <div>
                        <label className={labelCls}>Ціна за день ($)</label>
                        <div className="flex gap-2">
                            <input
                                type="number" min="0" placeholder="Від"
                                value={minPrice} onChange={e => setMinPrice(e.target.value)}
                                className={inputCls}
                            />
                            <input
                                type="number" min="0" placeholder="До"
                                value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* Рік */}
                    <div>
                        <label className={labelCls}>Рік випуску</label>
                        <div className="flex gap-2">
                            <input
                                type="number" min="2000" max={currentYear}
                                placeholder="Від"
                                value={minYear} onChange={e => setMinYear(e.target.value)}
                                className={inputCls}
                            />
                            <input
                                type="number" min="2000" max={currentYear}
                                placeholder="До"
                                value={maxYear} onChange={e => setMaxYear(e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </aside>
    );
};