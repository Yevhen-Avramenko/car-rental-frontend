import { useState, useEffect } from 'react';
import type { Car, CarCategory } from '@/entities/car/model/types';

// Тимчасові красиві дані для перевірки нашого UI
const MOCK_CARS: Car[] = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    pricePerDay: 1500,
    category: 'comfort',
    transmission: 'automatic',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: 2,
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2022,
    pricePerDay: 1200,
    category: 'economy',
    transmission: 'manual',
    imageUrl: 'https://images.unsplash.com/photo-1537984822441-cff330075342?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: 3,
    brand: 'BMW',
    model: 'X5',
    year: 2024,
    pricePerDay: 3500,
    category: 'suv',
    transmission: 'automatic',
    imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=800&q=80',
    isAvailable: false,
  }
];

export const useCars = ({ category }: { category: CarCategory | 'all' }) => {
  const [data, setData] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Імітація затримки мережі (0.5 секунди), щоб побачити стан "Завантаження..."
    setIsLoading(true);
    
    setTimeout(() => {
      if (category === 'all') {
        setData(MOCK_CARS);
      } else {
        setData(MOCK_CARS.filter(car => car.category === category));
      }
      setIsLoading(false);
    }, 500);
  }, [category]);

  return { data, isLoading };
};