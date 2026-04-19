import { useEffect, useState } from 'react';
import { getAllCars } from '@/entities/car/api/carService';
import { deleteCar, updateCar } from '@/features/admin/api/adminService';
import type { CarResponseDto } from '@/entities/car/model/types';
import axios from 'axios';

export const AdminCarsPage = () => {
    const [cars, setCars] = useState<CarResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState('');
    const [editDesc, setEditDesc] = useState('');

    const fetchCars = async () => {
        setLoading(true);
        try {
            const data = await getAllCars();
            setCars(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCars(); }, []);

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Видалити "${name}"? Це незворотня дія.`)) return;
        try {
            await deleteCar(id);
            setCars(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            if (axios.isAxiosError(err)) alert(err.response?.data?.message);
        }
    };

    const handleEditStart = (car: CarResponseDto) => {
        setEditingId(car.id);
        setEditPrice(String(car.pricePerDay));
        setEditDesc('');
    };

    const handleEditSave = async (id: number) => {
        try {
            await updateCar(id, {
                pricePerDay: editPrice ? Number(editPrice) : undefined,
                description: editDesc || undefined,
            });
            setCars(prev => prev.map(c =>
                c.id === id ? { ...c, pricePerDay: Number(editPrice) } : c
            ));
            setEditingId(null);
        } catch (err) {
            if (axios.isAxiosError(err)) alert(err.response?.data?.message);
        }
    };

    const inputCls = 'px-2 py-1 text-sm border border-warm-border rounded-lg outline-none focus:border-brand-primary';

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-warm-ink">Автомобілі</h1>
                    <p className="text-warm-muted mt-1">Управління автопарком</p>
                </div>
                <span className="bg-brand-light text-brand-primary text-sm px-3 py-1 rounded-full font-medium">
                    Всього: {cars.length}
                </span>
            </div>

            {loading ? (
                <div className="text-center py-20 text-warm-muted">Завантаження...</div>
            ) : (
                <div className="bg-white rounded-xl border border-warm-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-cream border-b border-warm-border">
                            <tr>
                                {['Фото', 'Авто', 'Клас / КПП', 'Ціна / день', 'Місто', 'Рейтинг', 'Дії'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs text-warm-muted font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-border">
                            {cars.map(car => (
                                <tr key={car.id} className="hover:bg-warm-cream/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <img
                                            src={car.imageUrl || 'https://via.placeholder.com/80x52'}
                                            alt={car.make}
                                            className="w-20 h-14 object-cover rounded-lg"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-warm-ink">{car.make} {car.model}</p>
                                        <p className="text-warm-muted">{car.year}</p>
                                    </td>
                                    <td className="px-4 py-3 text-warm-muted">
                                        {car.class} / {car.transmission}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingId === car.id ? (
                                            <input
                                                type="number"
                                                value={editPrice}
                                                onChange={e => setEditPrice(e.target.value)}
                                                className={`${inputCls} w-20`}
                                            />
                                        ) : (
                                            <span className="font-medium text-brand-primary">${car.pricePerDay}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-warm-muted">{car.location}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-warm-ink font-medium">
                                            ★ {car.rating > 0 ? car.rating.toFixed(1) : '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {editingId === car.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleEditSave(car.id)}
                                                        className="text-xs bg-brand-primary text-white px-3 py-1 rounded-lg hover:bg-brand-dark transition"
                                                    >
                                                        Зберегти
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-xs border border-warm-border text-warm-muted px-3 py-1 rounded-lg hover:bg-warm-cream transition"
                                                    >
                                                        Відмінити
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEditStart(car)}
                                                        className="text-xs border border-warm-border text-warm-ink px-3 py-1 rounded-lg hover:bg-warm-cream transition"
                                                    >
                                                        Редагувати
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(car.id, `${car.make} ${car.model}`)}
                                                        className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                                                    >
                                                        Видалити
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};