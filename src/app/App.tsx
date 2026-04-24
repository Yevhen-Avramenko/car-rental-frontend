import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/model/AuthProvider';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { Header } from '@/widgets/Header';
import { LoginPage } from '@/pages/LoginPage';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { CarDetailPage } from '@/pages/CarDetailPage';
import { BookingPage } from '@/pages/BookingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AboutPage } from '@/pages/AboutPage';
import { AdminRoute } from '@/shared/ui/AdminRoute';
import { AdminRentalsPage } from '@/pages/AdminRentalsPage';
import { AdminCarsPage } from '@/pages/AdminCarsPage';
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage';
import { PaymentCancelPage }  from '@/pages/PaymentCancelPage';
import { P2pCatalogPage } from '@/pages/P2pCatalogPage';
import { MyListingsPage }  from '@/pages/MyListingsPage';

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route 
                  path="/profile" 
                  element={
                      <ProtectedRoute>
                          <ProfilePage />
                      </ProtectedRoute>
                  } 
              />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/booking/:carId" element={<BookingPage />} />
              <Route path="/admin/rentals" element={
                  <AdminRoute><AdminRentalsPage /></AdminRoute>
               } />
              <Route path="/admin/cars" element={
                  <AdminRoute><AdminCarsPage /></AdminRoute>
               } />
               <Route path="/payment/success" element={<PaymentSuccessPage />} />
               <Route path="/payment/cancel"  element={<PaymentCancelPage />} /> 
               <Route path="/p2p" element={<P2pCatalogPage />} />
               <Route path="/p2p/my" element={
                  <ProtectedRoute><MyListingsPage /></ProtectedRoute>
               } />
            </Routes>
          </main>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
