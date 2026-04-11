import { useState } from 'react';
import { SearchBar, type SearchParams } from '@/features/car-catalog/ui/SearchBar';
import { CategoryFilter } from '@/features/car-catalog/ui/CategoryFilter';
import { CatalogWidget } from '@/widgets/CatalogWidget';
import { TrustBar } from '@/widgets/TrustBar';

export const HomePage = () => {
  
    const [activeCategory, setActiveCategory] = useState<string>('all');

    
    const handleSearch = (params: SearchParams) => {
        console.log('Шукаємо авто за параметрами:', params);
        // Пізніше ми підключимо сюди реальний запит до API з цими даними
    };

    return (
        <div className="min-h-screen bg-warm-cream">
            {/* Hero секція */}
            <section className="max-w-6xl mx-auto px-6 pt-14 pb-10">
                
                {/* Eyebrow (маленький акцент над заголовком) */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span className="text-xs text-brand-primary font-medium">
                        Найкраща оренда в місті
                    </span>
                </div>

                {/* Заголовок */}
                <h1 className="text-4xl font-medium text-warm-ink leading-tight mb-3">
                    Твоє авто на будь-який день —{' '}
                    <span className="text-brand-primary">просто й швидко</span>
                </h1>

                <p className="text-warm-muted text-base mb-8 max-w-lg">
                    Без зайвих форм, без очікування. Обираєш — бронюєш — їдеш. Всі авто застраховані та готові до подорожі.
                </p>

                {/* Пошук (передаємо нашу функцію) */}
                <div className="mb-8 shadow-sm">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* Фільтри по класах */}
                <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
            </section>

          
            <section className="max-w-6xl mx-auto px-6 pb-16">
               
                <CatalogWidget category={activeCategory} />
            </section>

            {/* Trust bar (Панель переваг) */}
            <TrustBar />
        </div>
    );
};