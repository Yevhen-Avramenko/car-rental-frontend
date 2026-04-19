import axios, { type AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
    baseURL: 'https://localhost:7073/api',
    headers: {
        'Content-Type': 'application/json'
    }
});


api.interceptors.request.use(
    (config) => {
       
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        return response; 
    },
    (error) => {
        
        if (axios.isAxiosError(error) && error.response?.status === 429) {
            // Показуємо глобальне повідомлення замість краша
            console.warn('Rate limit exceeded');
            return Promise.reject(
                new Error('Забагато запитів. Зачекайте хвилину та спробуйте знову.')
            );
        }
        if (error.response && error.response.status === 401) {
            console.warn('Токен недійсний. Виконуємо вихід...');
            localStorage.removeItem('token'); 
            
             
            
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);