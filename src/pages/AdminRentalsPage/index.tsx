import { useEffect, useState } from 'react';
import { getAllRentals, updateRentalStatus } from '@/features/admin/api/adminService';
import type { RentalResponseDto } from '@/entities/rental/model/types';
import axios from 'axios';

const STATUS_OPTIONS = ['Confirmed', 'Active', 'Completed', 'Cancelled'];

const statusLabel: Record<string, { label: string; cls: string }> = {
    Pending:   { label: 'Очікує',     cls: 'bg-yellow-100 text-yellow-700' },
    Confirmed: { label: 'Підтверджено', cls: 'bg-blue-100 text-blue-700' },
    Active:    { label: 'Активна',    cls: 'bg-green-100 text-green-700' },
    Completed: { label: 'Завершена',  cls: 'bg-gray-100 text-gray-600' },
    Cancelled: { label: 'Скасована',  cls: 'bg-red-100 text-red-500' },
};

export const AdminRentalsPage = () => {
    const [rentals, setRentals] = useState<RentalResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [updating, setUpdating] = useState<number | null>(null);

    const fetchRentals = async () => {
        setLoading(true);
        try {
            const data = await getAllRentals(filterStatus || undefined);
            setRentals(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRentals(); }, [filterStatus]);

    const handleStatusChange = async (id: number, newStatus: string) => {
        setUpdating(id);
        try {
            await updateRentalStatus(id, newStatus);
            setRentals(prev =>
                prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
            );
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.message || 'Помилка оновлення статусу');
            }
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-warm-ink">Бронювання</h1>
                    <p className="text-warm-muted mt-1">Управління всіма замовленнями</p>
                </div>
                <span className="bg-brand-light text-brand-primary text-sm px-3 py-1 rounded-full font-medium">
                    Всього: {rentals.length}
                </span>
            </div>

            {/* Фільтр по статусу */}
            <div className="flex gap-2 flex-wrap mb-6">
                {['', 'Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                            filterStatus === s
                                ? 'bg-warm-ink text-warm-cream'
                                : 'bg-white border border-warm-border text-warm-muted hover:text-warm-ink'
                        }`}
                    >
                        {s === '' ? 'Всі' : statusLabel[s]?.label ?? s}
                    </button>
                ))}
            </div>

            {/* Таблиця */}
            {loading ? (
                <div className="text-center py-20 text-warm-muted">Завантаження...</div>
            ) : (
                <div className="bg-white rounded-xl border border-warm-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-warm-cream border-b border-warm-border">
                            <tr>
                                {['#', 'Авто', 'Клієнт', 'Дати', 'Сума', 'Статус', 'Дія'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs text-warm-muted font-medium">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-border">
                            {rentals.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-warm-muted">
                                        Бронювань не знайдено
                                    </td>
                                </tr>
                            ) : rentals.map(r => {
                                const s = statusLabel[r.status] ?? { label: r.status, cls: 'bg-gray-100 text-gray-600' };
                                return (
                                    <tr key={r.id} className="hover:bg-warm-cream/50 transition-colors">
                                        <td className="px-4 py-3 text-warm-muted">#{r.id}</td>
                                        <td className="px-4 py-3 font-medium text-warm-ink">
                                            {r.carMake} {r.carModel}
                                        </td>
                                        <td className="px-4 py-3 text-warm-muted">
                                            {r.clientName ?? r.guestEmail ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-warm-muted whitespace-nowrap">
                                            {new Date(r.startDate).toLocaleDateString('uk-UA')} —{' '}
                                            {new Date(r.endDate).toLocaleDateString('uk-UA')}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-brand-primary">
                                            ${r.totalPrice}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.cls}`}>
                                                {s.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                disabled={updating === r.id}
                                                value={r.status}
                                                onChange={e => handleStatusChange(r.id, e.target.value)}
                                                className="text-xs border border-warm-border rounded-lg px-2 py-1 bg-white outline-none focus:border-brand-primary disabled:opacity-50"
                                            >
                                                <option value={r.status} disabled>{s.label}</option>
                                                {STATUS_OPTIONS.filter(o => o !== r.status).map(o => (
                                                    <option key={o} value={o}>
                                                        → {statusLabel[o]?.label ?? o}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};