import { useEffect, useState } from 'react';
import { getAllCars } from '@/entities/car/api/carService';
import {
    deleteCar, updateCar,
    createAdminCar, uploadAdminCarImages,
    type CreateCarAdminPayload
} from '@/features/admin/api/adminService';
import type { CarResponseDto } from '@/entities/car/model/types';
import axios from 'axios';

const TRANSMISSION = [{ v: 0, l: 'Automatic' }, { v: 1, l: 'Manual' }];
const FUEL         = [{ v: 0, l: 'Petrol' }, { v: 1, l: 'Diesel' }, { v: 2, l: 'Electric' }, { v: 3, l: 'Hybrid' }];
const CAR_CLASS    = [{ v: 0, l: 'Economy' }, { v: 1, l: 'Compact' }, { v: 2, l: 'Midsize' }, { v: 3, l: 'SUV' }, { v: 4, l: 'Premium' }, { v: 5, l: 'Minivan' }];

const emptyForm: CreateCarAdminPayload = {
    brandName: '', modelName: '', class: 0, transmission: 0, fuel: 0,
    numberOfSeats: 5, engineVolume: 1.6,
    city: '', address: '',
    year: new Date().getFullYear(), vin: '', licensePlate: '',
    pricePerDay: 0, description: ''
};

export const AdminCarsPage = () => {
    const [cars,      setCars]      = useState<CarResponseDto[]>([]);
    const [loading,   setLoading]   = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState('');
    const [editDesc,  setEditDesc]  = useState('');

    // Форма додавання
    const [showForm,  setShowForm]  = useState(false);
    const [form,      setForm]      = useState<CreateCarAdminPayload>(emptyForm);
    const [photos,    setPhotos]    = useState<File[]>([]);
    const [saving,    setSaving]    = useState(false);
    const [formError, setFormError] = useState('');

    const fetchCars = async () => {
        setLoading(true);
        try { setCars(await getAllCars()); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCars(); }, []);

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Видалити "${name}"?`)) return;
        try {
            await deleteCar(id);
            setCars(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            if (axios.isAxiosError(err)) alert(err.response?.data?.message);
        }
    };

    const handleEditSave = async (id: number) => {
        try {
            await updateCar(id, {
                pricePerDay: editPrice ? Number(editPrice) : undefined,
                description: editDesc || undefined,
            });
            setCars(prev => prev.map(c => c.id === id ? { ...c, pricePerDay: Number(editPrice) } : c));
            setEditingId(null);
        } catch (err) {
            if (axios.isAxiosError(err)) alert(err.response?.data?.message);
        }
    };

    const handleAddCar = async () => {
        setFormError('');
        if (!form.brandName || !form.modelName || !form.vin || !form.licensePlate || !form.city) {
            setFormError('Заповніть всі обов\'язкові поля.');
            return;
        }
        setSaving(true);
        try {
            const newCar = await createAdminCar(form);
            if (photos.length > 0) {
                await uploadAdminCarImages(newCar.id, photos);
            }
            await fetchCars();
            setShowForm(false);
            setForm(emptyForm);
            setPhotos([]);
        } catch (err) {
            if (axios.isAxiosError(err)) setFormError(err.response?.data?.message || 'Помилка');
            else setFormError('Невідома помилка');
        } finally {
            setSaving(false);
        }
    };

    const inputCls = 'px-3 py-2 text-sm border border-warm-border rounded-lg outline-none focus:border-brand-primary w-full';
    const labelCls = 'block text-xs text-warm-muted mb-1';

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-warm-ink">Автомобілі</h1>
                    <p className="text-warm-muted mt-1">Управління автопарком</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-brand-light text-brand-primary text-sm px-3 py-1 rounded-full font-medium">
                        Всього: {cars.length}
                    </span>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="bg-warm-ink text-warm-cream text-sm px-4 py-2 rounded-lg hover:bg-warm-ink/90 transition"
                    >
                        {showForm ? 'Скасувати' : '+ Додати авто'}
                    </button>
                </div>
            </div>

            {/* ── Форма додавання ── */}
            {showForm && (
                <div className="bg-white border border-warm-border rounded-xl p-6 mb-8 shadow-sm">
                    <h2 className="text-lg font-medium text-warm-ink mb-5">Нове авто</h2>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Марка *</label>
                            <input className={inputCls} placeholder="Toyota" value={form.brandName}
                                onChange={e => setForm(f => ({ ...f, brandName: e.target.value }))} />
                        </div>
                        <div>
                            <label className={labelCls}>Модель *</label>
                            <input className={inputCls} placeholder="Camry" value={form.modelName}
                                onChange={e => setForm(f => ({ ...f, modelName: e.target.value }))} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Клас</label>
                            <select className={inputCls} value={form.class}
                                onChange={e => setForm(f => ({ ...f, class: Number(e.target.value) }))}>
                                {CAR_CLASS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>КПП</label>
                            <select className={inputCls} value={form.transmission}
                                onChange={e => setForm(f => ({ ...f, transmission: Number(e.target.value) }))}>
                                {TRANSMISSION.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Паливо</label>
                            <select className={inputCls} value={form.fuel}
                                onChange={e => setForm(f => ({ ...f, fuel: Number(e.target.value) }))}>
                                {FUEL.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Місць</label>
                            <input type="number" className={inputCls} value={form.numberOfSeats}
                                onChange={e => setForm(f => ({ ...f, numberOfSeats: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <label className={labelCls}>Об'єм двигуна (л)</label>
                            <input type="number" step="0.1" className={inputCls} value={form.engineVolume}
                                onChange={e => setForm(f => ({ ...f, engineVolume: Number(e.target.value) }))} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Місто *</label>
                            <input className={inputCls} placeholder="Київ" value={form.city}
                                onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                        </div>
                        <div>
                            <label className={labelCls}>Адреса</label>
                            <input className={inputCls} placeholder="вул. Хрещатик 1" value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Рік</label>
                            <input type="number" className={inputCls} value={form.year}
                                onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <label className={labelCls}>VIN *</label>
                            <input className={inputCls} value={form.vin}
                                onChange={e => setForm(f => ({ ...f, vin: e.target.value }))} />
                        </div>
                        <div>
                            <label className={labelCls}>Держ. номер *</label>
                            <input className={inputCls} value={form.licensePlate}
                                onChange={e => setForm(f => ({ ...f, licensePlate: e.target.value }))} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Ціна/день ($) *</label>
                            <input type="number" className={inputCls} value={form.pricePerDay}
                                onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <label className={labelCls}>Опис</label>
                            <input className={inputCls} value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className={labelCls}>Фото</label>
                        <input
                            type="file" accept="image/*" multiple
                            onChange={e => setPhotos(Array.from(e.target.files ?? []))}
                            className="text-sm text-warm-muted"
                        />
                        {photos.length > 0 && (
                            <p className="text-xs text-warm-muted mt-1">
                                Обрано: {photos.map(f => f.name).join(', ')}
                            </p>
                        )}
                    </div>

                    {formError && <p className="text-sm text-red-500 mb-3">{formError}</p>}

                    <button
                        onClick={handleAddCar}
                        disabled={saving}
                        className="bg-brand-primary text-white text-sm px-6 py-2 rounded-lg hover:bg-brand-dark transition disabled:opacity-50"
                    >
                        {saving ? 'Збереження...' : 'Зберегти авто'}
                    </button>
                </div>
            )}

            {/* ── Таблиця авто (без змін) ── */}
            {loading ? (
                <div className="text-center py-20 text-warm-muted">Завантаження...</div>
            ) : (
                <div className="bg-white rounded-xl border border-warm-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-cream border-b border-warm-border">
                            <tr>
                                {['Фото','Авто','Клас / КПП','Ціна / день','Місто','Рейтинг','Дії'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs text-warm-muted font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-border">
                            {cars.map(car => (
                                <tr key={car.id} className="hover:bg-warm-cream/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <img src={car.imageUrl || 'https://via.placeholder.com/80x52'} alt={car.make}
                                            className="w-20 h-14 object-cover rounded-lg" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-warm-ink">{car.make} {car.model}</p>
                                        <p className="text-warm-muted">{car.year}</p>
                                    </td>
                                    <td className="px-4 py-3 text-warm-muted">{car.class} / {car.transmission}</td>
                                    <td className="px-4 py-3">
                                        {editingId === car.id ? (
                                            <input type="number" value={editPrice}
                                                onChange={e => setEditPrice(e.target.value)}
                                                className="px-2 py-1 text-sm border border-warm-border rounded-lg w-20" />
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
                                                    <button onClick={() => handleEditSave(car.id)}
                                                        className="text-xs bg-brand-primary text-white px-3 py-1 rounded-lg">
                                                        Зберегти
                                                    </button>
                                                    <button onClick={() => setEditingId(null)}
                                                        className="text-xs border border-warm-border text-warm-muted px-3 py-1 rounded-lg">
                                                        Скасувати
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setEditingId(car.id); setEditPrice(String(car.pricePerDay)); setEditDesc(''); }}
                                                        className="text-xs border border-warm-border text-warm-ink px-3 py-1 rounded-lg">
                                                        Редагувати
                                                    </button>
                                                    <button onClick={() => handleDelete(car.id, `${car.make} ${car.model}`)}
                                                        className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg">
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