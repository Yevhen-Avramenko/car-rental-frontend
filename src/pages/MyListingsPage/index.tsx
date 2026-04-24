import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    getMyListings, createP2pCar, updateP2pCar, deleteP2pCar,
    uploadP2pCarImage, getVehicleModels, getLocations,
    type CreateP2pCarPayload, type VehicleModelOption, type LocationOption,
} from '@/entities/p2p/api/p2pService';
import type { CarResponseDto } from '@/entities/car/model/types';

const emptyForm: CreateP2pCarPayload = {
    vehicleModelId: 0, locationId: 0,
    year: new Date().getFullYear(),
    vin: '', licensePlate: '', pricePerDay: 0, description: '',
};

export const MyListingsPage = () => {
    const navigate = useNavigate();

    const [cars,      setCars]      = useState<CarResponseDto[]>([]);
    const [models,    setModels]    = useState<VehicleModelOption[]>([]);
    const [locations, setLocations] = useState<LocationOption[]>([]);
    const [loading,   setLoading]   = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editId,   setEditId]   = useState<number | null>(null);
    const [form,     setForm]     = useState<CreateP2pCarPayload>(emptyForm);
    const [saving,   setSaving]   = useState(false);
    const [error,    setError]    = useState('');

    useEffect(() => {
        Promise.all([getMyListings(), getVehicleModels(), getLocations()])
            .then(([c, m, l]) => { setCars(c); setModels(m); setLocations(l); })
            .finally(() => setLoading(false));
    }, []);

    const openCreate = () => {
        setEditId(null);
        setForm(emptyForm);
        setError('');
        setShowForm(true);
    };

    const openEdit = (car: CarResponseDto) => {
        setEditId(car.id);
        setForm({
            ...emptyForm,
            pricePerDay: car.pricePerDay,
            description: '',
        });
        setError('');
        setShowForm(true);
    };

    const handleSave = async () => {
        setError('');
        if (!editId && !form.vehicleModelId) { setError('Оберіть модель авто.'); return; }
        if (!form.locationId)                { setError('Оберіть локацію.'); return; }
        if (!form.pricePerDay)               { setError('Вкажіть ціну за день.'); return; }

        setSaving(true);
        try {
            if (editId) {
                const updated = await updateP2pCar(editId, {
                    pricePerDay: form.pricePerDay,
                    description: form.description || undefined,
                    locationId:  form.locationId,
                });
                setCars(prev => prev.map(c => c.id === editId ? updated : c));
            } else {
                const created = await createP2pCar(form);
                setCars(prev => [created, ...prev]);
            }
            setShowForm(false);
            setEditId(null);
            setForm(emptyForm);
        } catch (err) {
            if (axios.isAxiosError(err))
                setError(err.response?.data?.message || 'Помилка збереження');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Видалити оголошення?')) return;
        try {
            await deleteP2pCar(id);
            setCars(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            if (axios.isAxiosError(err))
                alert(err.response?.data?.message || 'Помилка видалення');
        }
    };

    const handleImage = async (carId: number, file: File) => {
        try {
            const url = await uploadP2pCarImage(carId, file);
            setCars(prev => prev.map(c => c.id === carId ? { ...c, imageUrl: url } : c));
        } catch {
            alert('Не вдалося завантажити фото');
        }
    };

    const inputCls = 'w-full px-3 py-2 text-sm border border-warm-border rounded-lg focus:border-brand-primary outline-none bg-white';
    const labelCls = 'block text-xs text-warm-muted mb-1';

    if (loading) return <div className="text-center py-20 text-warm-muted">Завантаження...</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => navigate('/p2p')}
                        className="text-xs text-warm-muted hover:text-warm-ink mb-1 flex items-center gap-1"
                    >
                        ← P2P каталог
                    </button>
                    <h1 className="text-3xl font-medium text-warm-ink">Мої оголошення</h1>
                    <p className="text-warm-muted mt-1">
                        {cars.length > 0 ? `${cars.length} авто` : 'Немає активних оголошень'}
                    </p>
                </div>
                <button
                    onClick={showForm ? () => setShowForm(false) : openCreate}
                    className="bg-warm-ink text-warm-cream text-sm px-4 py-2 rounded-lg hover:bg-warm-ink/90 transition"
                >
                    {showForm ? 'Скасувати' : '+ Нове оголошення'}
                </button>
            </div>

            {/* ── Форма ── */}
            {showForm && (
                <div className="bg-white border border-warm-border rounded-xl p-6 mb-8 shadow-sm">
                    <h2 className="font-medium text-warm-ink mb-5">
                        {editId ? 'Редагування оголошення' : 'Нове оголошення'}
                    </h2>

                    {/* Модель — тільки при створенні */}
                    {!editId && (
                        <div className="mb-4">
                            <label className={labelCls}>Модель авто *</label>
                            <select className={inputCls} value={form.vehicleModelId}
                                onChange={e => setForm(f => ({ ...f, vehicleModelId: Number(e.target.value) }))}>
                                <option value={0}>Оберіть модель...</option>
                                {models.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.brandName} {m.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Локація */}
                    <div className="mb-4">
                        <label className={labelCls}>Місто / адреса *</label>
                        <select className={inputCls} value={form.locationId}
                            onChange={e => setForm(f => ({ ...f, locationId: Number(e.target.value) }))}>
                            <option value={0}>Оберіть локацію...</option>
                            {locations.map(l => (
                                <option key={l.id} value={l.id}>
                                    {l.city}{l.address ? `, ${l.address}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ціна і рік */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Ціна за день ($) *</label>
                            <input type="number" min={1} className={inputCls}
                                value={form.pricePerDay || ''}
                                onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))} />
                        </div>
                        {!editId && (
                            <div>
                                <label className={labelCls}>Рік випуску</label>
                                <input type="number" className={inputCls}
                                    value={form.year}
                                    onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} />
                            </div>
                        )}
                    </div>

                    {/* VIN і номер — тільки при створенні, необов'язково */}
                    {!editId && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={labelCls}>VIN (необов'язково)</label>
                                <input className={inputCls} value={form.vin}
                                    onChange={e => setForm(f => ({ ...f, vin: e.target.value }))}
                                    placeholder="WVWZZZ1KZAM123456" />
                            </div>
                            <div>
                                <label className={labelCls}>Держ. номер (необов'язково)</label>
                                <input className={inputCls} value={form.licensePlate}
                                    onChange={e => setForm(f => ({ ...f, licensePlate: e.target.value }))}
                                    placeholder="АА 1234 АА" />
                            </div>
                        </div>
                    )}

                    {/* Опис */}
                    <div className="mb-5">
                        <label className={labelCls}>Опис</label>
                        <textarea rows={3} className={inputCls} value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Стан авто, особливості, умови оренди..." />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>
                    )}

                    <button onClick={handleSave} disabled={saving}
                        className="bg-brand-primary text-white text-sm px-6 py-2.5 rounded-lg hover:bg-brand-dark transition disabled:opacity-50">
                        {saving ? 'Збереження...' : editId ? 'Зберегти зміни' : 'Додати оголошення'}
                    </button>
                </div>
            )}

            {/* ── Список ── */}
            {cars.length === 0 ? (
                <div className="text-center py-20 text-warm-muted border border-dashed border-warm-border rounded-xl">
                    <p className="text-4xl mb-3">🚗</p>
                    <p className="font-medium text-warm-ink">У вас ще немає оголошень</p>
                    <p className="text-sm mt-1">Натисніть "+ Нове оголошення" щоб додати своє авто</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cars.map(car => (
                        <div key={car.id}
                             className="bg-white border border-warm-border rounded-xl p-4 flex gap-4 items-start hover:shadow-sm transition">
                            {/* Фото з можливістю заміни */}
                            <div className="relative w-32 h-24 bg-warm-cream rounded-lg overflow-hidden shrink-0 group">
                                <img
                                    src={car.imageUrl || 'https://via.placeholder.com/200x150?text=Фото'}
                                    alt={`${car.make} ${car.model}`}
                                    className="w-full h-full object-cover"
                                />
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer flex items-center justify-center text-white text-xs font-medium gap-1">
                                    📷 Змінити
                                    <input type="file" accept="image/*" className="hidden"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImage(car.id, file);
                                        }} />
                                </label>
                            </div>

                            {/* Інформація */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-warm-ink">
                                    {car.make} {car.model} · {car.year}
                                </p>
                                <p className="text-xs text-warm-muted mt-0.5">
                                    📍 {car.location}
                                </p>
                                <p className="text-brand-primary text-sm font-medium mt-2">
                                    ${car.pricePerDay}
                                    <span className="text-warm-muted font-normal"> / день</span>
                                </p>
                            </div>

                            {/* Дії */}
                            <div className="flex flex-col gap-2 shrink-0">
                                <button
                                    onClick={() => navigate(`/cars/${car.id}`)}
                                    className="text-xs border border-warm-border text-warm-muted px-3 py-1.5 rounded-lg hover:bg-warm-cream transition text-center"
                                >
                                    Переглянути
                                </button>
                                <button
                                    onClick={() => openEdit(car)}
                                    className="text-xs border border-warm-border text-warm-ink px-3 py-1.5 rounded-lg hover:bg-warm-cream transition text-center"
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(car.id)}
                                    className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition text-center"
                                >
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};