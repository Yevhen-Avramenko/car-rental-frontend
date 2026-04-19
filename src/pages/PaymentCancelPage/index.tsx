import { Link } from 'react-router-dom';

export const PaymentCancelPage = () => (
    <div className="min-h-[calc(100vh-70px)] bg-warm-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-warm-border shadow-sm text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                ✕
            </div>
            <h1 className="text-2xl font-medium text-warm-ink mb-2">
                Оплату скасовано
            </h1>
            <p className="text-warm-muted mb-6">
                Бронювання збережено зі статусом "Очікує". Ви можете оплатити пізніше в особистому кабінеті.
            </p>
            <div className="space-y-3">
                <Link
                    to="/profile"
                    className="block w-full bg-warm-ink text-warm-cream py-3 rounded-xl text-sm font-medium hover:bg-warm-ink/90 transition"
                >
                    Мої бронювання
                </Link>
                <Link
                    to="/catalog"
                    className="block w-full text-warm-muted hover:text-warm-ink py-2 text-sm transition"
                >
                    До каталогу
                </Link>
            </div>
        </div>
    </div>
);