import { api } from '@/shared/api/axiosConfig';
import type { RentalResponseDto } from '@/entities/rental/model/types';
export type { RentalResponseDto };
export interface CreateRentalDto {
    carId: number;
    startDate: string;
    endDate: string;
    guestFirstName?: string;
    guestLastName?: string;
    guestEmail?: string;
    guestPhone?: string;
}


export const createRental = async (dto: CreateRentalDto): Promise<RentalResponseDto> => {
    const response = await api.post<RentalResponseDto>('/Rentals', dto);
    return response.data;
};