import { Link } from 'react-router-dom';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';

export const RegisterPage = () => {
    return (
        // Використовуємо calc(100vh - висота хедера), щоб відцентрувати по вертикалі
        <div className="min-h-[calc(100vh-70px)] bg-warm-cream flex items-center justify-center p-6 py-12">
            <div className="max-w-md w-full bg-white p-8 rounded-xl border border-warm-border shadow-sm">
                <h1 className="text-2xl font-medium text-warm-ink mb-2 text-center">Створення акаунту</h1>
                <p className="text-sm text-warm-muted mb-8 text-center">Приєднуйтесь до Key2Go та орендуйте авто вже сьогодні</p>
                
                <RegisterForm />

                <div className="mt-6 text-center text-sm">
                    <span className="text-warm-muted">Вже є акаунт? </span>
                    <Link to="/login" className="text-brand-primary font-medium hover:underline">
                        Увійти
                    </Link>
                </div>
            </div>
        </div>
    );
};