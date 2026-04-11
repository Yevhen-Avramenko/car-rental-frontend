

const categories = [
    { value: 'all', label: 'Всі авто' },
    { value: 'Economy', label: 'Економ' },
    { value: 'Comfort', label: 'Комфорт' },
    { value: 'Business', label: 'Бізнес' },
    { value: 'SUV', label: 'Позашляховик' },
    { value: 'Minivan', label: 'Мінівен' },
];

interface CategoryFilterProps {
    activeCategory: string;
    onChange: (category: string) => void;
}

export const CategoryFilter = ({ activeCategory, onChange }: CategoryFilterProps) => {
    return (
        <div className="flex gap-2 flex-wrap">
            {categories.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        activeCategory === value
                            ? 'bg-warm-ink text-warm-cream'
                            : 'bg-white border border-warm-border text-warm-muted hover:text-warm-ink'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};