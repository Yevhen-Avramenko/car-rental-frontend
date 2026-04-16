import axios, { type AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
    baseURL: 'https://localhost:7073/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Інтерцептор ЗАПИТІВ (Request Interceptor)
api.interceptors.request.use(
    (config) => {
        // Завжди беремо свіжий токен з localStorage
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            // Додаємо його до заголовка Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Інтерцептор ВІДПОВІДЕЙ (Response Interceptor)
api.interceptors.response.use(
    (response) => {
        return response; // Якщо все добре, просто повертаємо дані
    },
    (error) => {
        // Якщо бекенд відповів 401 Unauthorized (токен прострочений або невірний)
        if (error.response && error.response.status === 401) {
            console.warn('Токен недійсний. Виконуємо вихід...');
            localStorage.removeItem('token'); // Видаляємо токен
            
            // Замість React Router тут використовуємо window.location для жорсткого редіректу, 
            // оскільки axios знаходиться поза контекстом роутера
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);