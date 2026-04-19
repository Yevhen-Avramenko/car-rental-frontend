import { api } from '@/shared/api/axiosConfig';
import type { CarResponseDto } from '@/entities/car/model/types';

export interface RecommendationItem {
    carId: number;
    reason: string;
}

export interface RecommendationsResponse {
    recommendations: RecommendationItem[];
    isAiGenerated: boolean;
}

export const getRecommendations = async (): Promise<RecommendationsResponse> => {
    const response = await api.get<RecommendationsResponse>('/recommendations');
    return response.data;
};


export const getCarsByIds = async (ids: number[]): Promise<CarResponseDto[]> => {
    const promises = ids.map(id =>
        api.get<CarResponseDto>(`/Cars/${id}`)
           .then(r => r.data)
           .catch(() => null)
    );
    const results = await Promise.all(promises);
    return results.filter(Boolean) as CarResponseDto[];
};