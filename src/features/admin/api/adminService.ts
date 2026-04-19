import { api } from '@/shared/api/axiosConfig';
import type { RentalResponseDto } from '@/entities/rental/model/types';
import type { CarResponseDto } from '@/entities/car/model/types';


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