import { api } from '@/shared/api/axiosConfig';
import { type RentalResponseDto } from '@/entities/rental/model/types';

export const getMyRentals = async (): Promise<RentalResponseDto[]> => {
    const response = await api.get<RentalResponseDto[]>('/Rentals/my');
    return response.data;
};

export const cancelRental = async (id: number): Promise<void> => {
    await api.patch(`/Rentals/${id}/cancel`);
};

export const addReview = async (dto: { carId: number; rating: number; comment: string }): Promise<void> => {
    await api.post('/Reviews', dto);
};