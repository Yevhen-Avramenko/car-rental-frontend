export type CarCategory = 'economy' | 'comfort' | 'business' | 'suv' | 'minivan';

export interface CarResponseDto {
    id: number;
    make: string;
    model: string;
    year: number;
    class: string;
    transmission: string;
    fuel: string;
    pricePerDay: number;
    location: string;
    imageUrl: string;
    rating: number;
    isAvailable: boolean;
}