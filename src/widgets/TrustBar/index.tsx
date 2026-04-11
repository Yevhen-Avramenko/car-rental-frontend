const stats = [
    { value: '200+',  label: 'Авто в парку' },
    { value: '15 хв', label: 'Оформлення' },
    { value: '24/7',  label: 'Підтримка' },
    { value: '4.9★',  label: 'Рейтинг' },
];

export const TrustBar = () => {
    return (
        <div className="bg-warm-ink">
            <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(({ value, label }, i) => (
                    <div
                        key={i}
                        className={`text-center px-4 ${
                            i < stats.length - 1 ? 'md:border-r border-white/10' : ''
                        }`}
                    >
                        <p className="text-xl font-medium text-warm-cream">{value}</p>
                        <p className="text-xs text-warm-cream/50 mt-1">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};