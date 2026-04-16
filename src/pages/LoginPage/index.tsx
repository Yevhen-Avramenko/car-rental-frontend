import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export const LoginPage = () => {
    return (
        <div className="min-h-[calc(100-70px)] bg-warm-cream flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-xl border border-warm-border shadow-sm">
                <h1 className="text-2xl font-medium text-warm-ink mb-2 text-center">Вхід до Key2Go</h1>
                <p className="text-sm text-warm-muted mb-8 text-center">Раді бачити вас знову!</p>
                
                <LoginForm />

                <div className="mt-6 text-center text-sm">
                    <span className="text-warm-muted">Ще не маєте акаунту? </span>
                    <Link to="/register" className="text-brand-primary font-medium hover:underline">
                        Реєстрація
                    </Link>
                </div>
            </div>
        </div>
    );
};