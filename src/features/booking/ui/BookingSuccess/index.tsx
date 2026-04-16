import { Link } from 'react-router-dom';
import { type RentalResponseDto } from '../../api/bookingService';

export const BookingSuccess = ({ rental }: { rental: RentalResponseDto }) => (
    <div className="bg-white p-8 rounded-xl border border-warm-border shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
        </div>
        <h2 className="text-2xl font-medium text-warm-ink mb-2">Бронювання підтверджено!</h2>
        <p className="text-warm-muted mb-6">Деталі замовлення надіслано на <span className="font-medium text-warm-ink">{rental.guestEmail}</span>.</p>
        
        <div className="bg-warm-cream p-4 rounded-lg text-left mb-8 max-w-sm mx-auto space-y-2 text-sm text-warm-ink">
            <p>Номер замовлення: <span className="font-medium">#{rental.id}</span></p>
            <p>Дати: <span className="font-medium">{new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}</span></p>
            <p>До сплати: <span className="font-medium text-brand-primary">${rental.totalPrice}</span></p>
        </div>

        <div className="space-y-3">
            <Link to="/register" className="block w-full bg-warm-ink text-warm-cream text-center py-3 rounded-lg hover:bg-warm-ink/90 transition">
                Зареєструватись для керування
            </Link>
            <Link to="/" className="block w-full text-warm-muted hover:text-warm-ink py-2 transition">
                Повернутись до каталогу
            </Link>
        </div>
    </div>
);