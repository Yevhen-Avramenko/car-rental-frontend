import { api } from '@/shared/api/axiosConfig';
import { type CarDetailDto, type CarResponseDto } from '../model/types';

export const getCarById = async (id: number): Promise<CarDetailDto> => {
    const response = await api.get<CarDetailDto>(`/Cars/${id}`);
    return response.data;
};
export interface CarFilterParams {
    class?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    transmission?: string;
    fuel?: string;
    minYear?: number;
    maxYear?: number;
    minSeats?: number;
}
export const getAllCars = async (filters?: CarFilterParams): Promise<CarResponseDto[]> => {
    const response = await api.get<CarResponseDto[]>('/Cars', { params: filters });
    return response.data;
};
export interface BookedPeriod {
    startDate: string; // 
    endDate:   string;
}

export const getBookedDates = async (carId: number): Promise<BookedPeriod[]> => {
    const response = await api.get<BookedPeriod[]>(`/Cars/${carId}/booked-dates`);
    return response.data;
};