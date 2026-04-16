import { api } from '@/shared/api/axiosConfig';

export interface CreateRentalDto {
    carId: number;
    startDate: string;
    endDate: string;
    guestFirstName?: string;
    guestLastName?: string;
    guestEmail?: string;
    guestPhone?: string;
}

export interface RentalResponseDto {
    id: number;
    carId: number;
    userId?: number;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    isGuest: boolean;
    guestEmail?: string;
}

export const createRental = async (dto: CreateRentalDto): Promise<RentalResponseDto> => {
    const response = await api.post<RentalResponseDto>('/Rentals', dto);
    return response.data;
};