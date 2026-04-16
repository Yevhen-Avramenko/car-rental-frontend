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
export interface ReviewDto {
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface CarDetailDto extends CarResponseDto {
    description: string;
    numberOfSeats: number;
    engineVolume: number;
    address: string;
    reviews: ReviewDto[];
}