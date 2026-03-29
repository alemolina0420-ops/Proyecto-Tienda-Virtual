import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

// Public pages
import { PublicLayout } from '@/pages/public/PublicLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import { ProductsPage } from '@/pages/public/ProductsPage';
import { ProductDetailPage } from '@/pages/public/ProductDetailPage';
import { WarrantyPage } from '@/pages/public/WarrantyPage';
import { ContactPage } from '@/pages/public/ContactPage';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Admin pages
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { ProductsPage as AdminProductsPage } from '@/pages/admin/ProductsPage';
import { CategoriesPage } from '@/pages/admin/CategoriesPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';
import { DeveloperPage } from '@/pages/admin/DeveloperPage';

// Context
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Admin Route Guard - requires authentication
function AdminRouteGuard() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

// Developer Route Guard - requires developer role
function DeveloperRouteGuard() {
  const { isDeveloper } = useAuth();
  return isDeveloper ? <Outlet /> : <Navigate to="/admin" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/categoria/:categoryId" element={<ProductsPage />} />
        <Route path="/producto/:productId" element={<ProductDetailPage />} />
        <Route path="/garantia" element={<WarrantyPage />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes - Protected */}
      <Route element={<AdminRouteGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          
          {/* Developer Only Routes */}
          <Route element={<DeveloperRouteGuard />}>
            <Route path="/admin/developer" element={<DeveloperPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
