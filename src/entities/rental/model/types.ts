export interface RentalResponseDto {
    id: number;
    carId: number;
    userId?: number;

    carMake: string;
    carModel: string;
    carImageUrl: string;

    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string; 
    createdAt: string;

    isGuest: boolean;

    
    guestEmail?: string;
    guestFirstName?: string;
    guestLastName?: string;
    guestPhone?: string;

  
    clientName?: string;
}