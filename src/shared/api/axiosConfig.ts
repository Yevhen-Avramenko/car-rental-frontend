import axios, { type AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
    baseURL: 'https://localhost:7073/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});