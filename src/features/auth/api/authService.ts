import { api } from '@/shared/api/axiosConfig';

export interface AuthResponseDto {
    token: string;
    message: string;
    isSuccess: boolean;
}
export interface RegisterRequestDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const loginUser = async (dto: { email: string; password: string }): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>('/Auth/login', dto);
    return response.data;
};

export const registerUser = async (dto: RegisterRequestDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>('/Auth/register', dto);
    return response.data;
};