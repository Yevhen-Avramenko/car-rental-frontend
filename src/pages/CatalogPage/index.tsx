import { CatalogWidget } from '@/widgets/CatalogWidget';

export const CatalogPage = () => {
    return (
        <div className="min-h-screen bg-warm-cream">
            <section className="max-w-6xl mx-auto px-6 pt-14 pb-16">
                
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span className="text-xs text-brand-primary font-medium">
                        Наш автопарк
                    </span>
                </div>

                <h1 className="text-4xl font-medium text-warm-ink leading-tight mb-2">
                    Каталог автомобілів
                </h1>
                <p className="text-warm-muted text-base mb-8 max-w-lg">
                    Обирайте найкраще авто для вашої подорожі. Всі автомобілі проходять регулярний технічний огляд.
                </p>
                
                <CatalogWidget />
                
            </section>
        </div>
    );
};