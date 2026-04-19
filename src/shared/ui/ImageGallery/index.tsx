import { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

export const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
    const [current, setCurrent] = useState(0);

    
    const list = images.length > 0
        ? images
        : ['https://via.placeholder.com/800x500?text=No+Image'];

    const prev = () => setCurrent(i => (i - 1 + list.length) % list.length);
    const next = () => setCurrent(i => (i + 1) % list.length);

    return (
        <div className="flex flex-col gap-3">

            {/* Головне фото */}
            <div className="relative bg-warm-cream rounded-2xl overflow-hidden border border-warm-border aspect-video">
                <img
                    key={current}
                    src={list[current]}
                    alt={`${alt} — фото ${current + 1}`}
                    className="w-full h-full object-contain p-2 transition-opacity duration-200"
                />

                {/* Стрілки — тільки якщо більше 1 фото */}
                {list.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-warm-border w-9 h-9 rounded-full flex items-center justify-center text-warm-ink shadow-sm transition-colors"
                            aria-label="Попереднє фото"
                        >
                            ‹
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-warm-border w-9 h-9 rounded-full flex items-center justify-center text-warm-ink shadow-sm transition-colors"
                            aria-label="Наступне фото"
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Лічильник */}
                {list.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {current + 1} / {list.length}
                    </span>
                )}
            </div>

            {/* Мініатюри */}
            {list.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {list.map((url, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                                i === current
                                    ? 'border-brand-primary'
                                    : 'border-warm-border hover:border-warm-muted'
                            }`}
                        >
                            <img
                                src={url}
                                alt={`мініатюра ${i + 1}`}
                                className="w-full h-full object-contain bg-warm-cream"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};