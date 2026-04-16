import { TrustBar } from '@/widgets/TrustBar';

export const AboutPage = () => {
    return (
        <div className="bg-warm-cream min-h-screen pt-10">
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white rounded-2xl border border-warm-border shadow-sm">
                <h1 className="text-4xl font-medium text-warm-ink mb-6 text-center">Про нас</h1>
                
                <section className="mb-10">
                    <h2 className="text-2xl font-medium text-warm-ink mb-4">Хто ми?</h2>
                    <p className="text-warm-muted leading-relaxed">
                        Key2Go — це сучасний сервіс оренди автомобілів, створений для тих, хто цінує свій час та комфорт. Ми об'єднуємо передові технології та високий рівень сервісу, щоб зробити процес оренди максимально прозорим, швидким та безпечним.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-medium text-warm-ink mb-4">Чому обирають нас?</h2>
                    <ul className="list-disc list-inside text-warm-muted space-y-2">
                        <li>Швидке онлайн-бронювання без прихованих платежів</li>
                        <li>Широкий автопарк: від економ до преміум-класу</li>
                        <li>Цілодобова підтримка клієнтів</li>
                        <li>Гнучкі умови оренди та страхування</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-medium text-warm-ink mb-4">Наша команда</h2>
                    <p className="text-warm-muted leading-relaxed">
                        Ми — команда ентузіастів та професіоналів, які прагнуть змінити ринок мобільності в Україні. Наша мета — надати вам найкращий автомобіль для ваших потреб, незалежно від того, чи це ділова поїздка, чи сімейна подорож.
                    </p>
                </section>
            </div>
            
             <TrustBar /> 
        </div>
    );
};