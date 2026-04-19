import { Link, useSearchParams } from 'react-router-dom';

export const PaymentSuccessPage = () => {
    const [params] = useSearchParams();
    // WayForPay передає orderReference у query-параметрах редіректу
    const orderReference = params.get('orderReference');
    const status         = params.get('transactionStatus');
    const isPaid         = !status || status === 'Approved';

    return (
        <div className="min-h-[calc(100vh-70px)] bg-warm-cream flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-warm-border shadow-sm text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl ${
                    isPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                    {isPaid ? '✓' : '⏳'}
                </div>

                <h1 className="text-2xl font-medium text-warm-ink mb-2">
                    {isPaid ? 'Оплату підтверджено!' : 'Обробляємо платіж…'}
                </h1>

                <p className="text-warm-muted mb-6">
                    {isPaid
                        ? 'Ваше бронювання успішно оплачено через WayForPay.'
                        : `Статус: ${status ?? 'невідомо'}. Ми повідомимо вас після підтвердження.`}
                </p>

                {orderReference && (
                    <p className="text-sm bg-warm-cream rounded-lg px-4 py-2 text-warm-muted mb-6">
                        Замовлення:{' '}
                        <span className="font-medium text-warm-ink">{orderReference}</span>
                    </p>
                )}

                <div className="space-y-3">
                    <Link
                        to="/profile"
                        className="block w-full bg-warm-ink text-warm-cream py-3 rounded-xl text-sm font-medium hover:bg-warm-ink/90 transition"
                    >
                        Мої бронювання
                    </Link>
                    <Link
                        to="/"
                        className="block w-full text-warm-muted hover:text-warm-ink py-2 text-sm transition"
                    >
                        На головну
                    </Link>
                </div>
            </div>
        </div>
    );
};
