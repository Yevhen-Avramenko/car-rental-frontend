import { api } from '@/shared/api/axiosConfig';
import type { RentalResponseDto } from '@/entities/rental/model/types';
import type { CarResponseDto } from '@/entities/car/model/types';
import axios from 'axios';


export const getAllRentals = async (status?: string): Promise<RentalResponseDto[]> => {
    const response = await api.get<RentalResponseDto[]>('/admin/rentals', {
        params: status ? { status } : {}
    });
    return response.data;
};

export const updateRentalStatus = async (id: number, status: string): Promise<void> => {
    await api.patch(`/admin/rentals/${id}/status`, { status });
};


export interface UpdateCarPayload {
    pricePerDay?: number;
    description?: string;
    locationId?: number;
}

export const updateCar = async (id: number, data: UpdateCarPayload): Promise<CarResponseDto> => {
    const response = await api.put<CarResponseDto>(`/admin/cars/${id}`, data);
    return response.data;
};

export const deleteCar = async (id: number): Promise<void> => {
    await api.delete(`/admin/cars/${id}`);
};
export interface CreateCarAdminPayload {
    brandName:    string;
    modelName:    string;
    class:        number; // enum значення
    transmission: number;
    fuel:         number;
    numberOfSeats: number;
    engineVolume: number;
    city:         string;
    address:      string;
    year:         number;
    vin:          string;
    licensePlate: string;
    pricePerDay:  number;
    description:  string;
}

export const createAdminCar = async (data: CreateCarAdminPayload): Promise<CarResponseDto> => {
    const response = await api.post<CarResponseDto>('/admin/cars', data);
    return response.data;
};

export const uploadAdminCarImages = async (carId: number, files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    const response = await api.post<string[]>(`/admin/cars/${carId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
export const downloadRentalContract = async (rentalId: number): Promise<void> => {
    try {
        const response = await api.get(
            `/admin/rentals/${rentalId}/contract`,
            { responseType: 'blob' }
        );

        // Якщо бекенд повернув JSON з помилкою (не blob) — покажемо її
        if (response.data.type === 'application/json') {
            const text = await response.data.text();
            alert('Помилка: ' + JSON.parse(text).message);
            return;
        }

        const url  = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href  = url;
        link.setAttribute('download', `contract_${String(rentalId).padStart(4, '0')}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            // Blob response з помилкою — читаємо текст
            const text = await err.response?.data?.text?.();
            const msg  = text ? JSON.parse(text).message : err.message;
            alert('Помилка генерації договору: ' + msg);
        } else {
            alert('Невідома помилка');
        }
        console.error('Contract download error:', err);
    }
};