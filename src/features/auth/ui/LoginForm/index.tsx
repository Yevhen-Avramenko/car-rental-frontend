import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/useAuth';
import { loginUser } from '../../api/authService';
import { Button } from '@/shared/ui/Button';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await loginUser({ email, password });
            if (result.isSuccess) {
                login(result.token);
                navigate('/');
            } else {
                setError(result.message);
            }
        } catch {
            setError('Невірний логін або пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs text-warm-muted mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 text-sm border border-warm-border rounded-md outline-none focus:border-brand-primary bg-white"
                    placeholder="example@mail.com"
                />
            </div>
            <div>
                <label className="block text-xs text-warm-muted mb-1">Пароль</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 text-sm border border-warm-border rounded-md outline-none focus:border-brand-primary bg-white"
                    placeholder="••••••"
                />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button type="submit" className="w-full py-3" disabled={isLoading}>
                {isLoading ? 'Вхід...' : 'Увійти'}
            </Button>
        </form>
    );
};