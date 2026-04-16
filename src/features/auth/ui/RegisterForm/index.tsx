import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authService';
import { Button } from '@/shared/ui/Button';

export const RegisterForm = () => {
    // Стан для всіх полів
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Стан для UI
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Фронтенд-валідація
        if (password.length < 6) {
            return setError('Пароль має містити мінімум 6 символів');
        }
        if (password !== confirmPassword) {
            return setError('Паролі не співпадають');
        }

        setIsLoading(true);

        try {
            // Відправляємо дані на бекенд (без confirmPassword)
            const result = await registerUser({ firstName, lastName, email, password });
            
            if (result.isSuccess) {
                // Якщо все добре, відправляємо на логін
                // (Можна було б одразу логінити, але класичний flow - це редірект на сторінку входу)
                navigate('/login');
            } else {
                setError(result.message || 'Помилка при реєстрації');
            }
        } catch  {
            setError('Не вдалося з\'єднатися з сервером. Спробуйте пізніше.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-warm-muted mb-1">Ім'я</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-4 py-2 text-sm border border-warm-border rounded-md outline-none focus:border-brand-primary bg-white"
                        placeholder="Іван"
                    />
                </div>
                <div>
                    <label className="block text-xs text-warm-muted mb-1">Прізвище</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-4 py-2 text-sm border border-warm-border rounded-md outline-none focus:border-brand-primary bg-white"
                        placeholder="Франко"
                    />
                </div>
            </div>

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
                    placeholder="Мінімум 6 символів"
                />
            </div>

            <div>
                <label className="block text-xs text-warm-muted mb-1">Підтвердження пароля</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 text-sm border border-warm-border rounded-md outline-none focus:border-brand-primary bg-white"
                    placeholder="Повторіть пароль"
                />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button type="submit" className="w-full py-3 mt-2" disabled={isLoading}>
                {isLoading ? 'Реєстрація...' : 'Створити акаунт'}
            </Button>
        </form>
    );
};