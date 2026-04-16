export interface RentalResponseDto {
    id: number;
    carId: number;
    carMake: string;
    carModel: string;
    carImageUrl: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string; // 'Pending', 'Active', 'Completed', 'Cancelled', 'Rejected'
    createdAt: string;
    isGuest: boolean;
}