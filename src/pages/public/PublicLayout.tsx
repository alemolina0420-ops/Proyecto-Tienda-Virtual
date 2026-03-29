import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ChevronDown,
  Package,
  Cpu,
  ShoppingCart,
  Home,
  Shield,
  Phone,
  UserPlus,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ProductsProvider, useProducts } from '@/contexts/ProductsContext';

// Inner component that uses the contexts
function PublicLayoutContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { categories, products, siteConfig } = useProducts();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Scroll detection for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter((p) => p.category === categoryId).length;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-900/98 backdrop-blur-xl shadow-lg shadow-blue-500/5 border-b border-blue-500/10'
            : 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" aria-label="Ir al inicio">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                <Cpu className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="absolute inset-0 rounded-lg bg-blue-400/5 group-hover:bg-blue-400/10 transition-colors" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-white text-sm tracking-wide group-hover:text-blue-100 transition-colors">
                  {siteConfig.brandName}
                </h1>
                <p className="text-[10px] text-blue-400/70 font-medium tracking-wider uppercase">
                  {siteConfig.tagline}
                </p>
              </div>
            </Link>

            {/* ==========================================
                DESKTOP NAVIGATION (visible md and above)
               ========================================== */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute('/')
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                Inicio
              </Link>

              {/* Products Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActiveRoute('/productos') || isActiveRoute('/categoria')
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    Productos
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-gray-900 border-gray-700/60 shadow-xl shadow-black/40">
                  <div className="p-1.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold px-2.5 py-1.5">
                      Categorías
                    </p>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => navigate(`/categoria/${category.id}`)}
                        className="flex items-center justify-between cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800/70 rounded-md"
                      >
                        <span>{category.name}</span>
                        <span className="text-[10px] font-mono text-gray-600 bg-gray-800/60 px-1.5 py-0.5 rounded">
                          {getCategoryProductCount(category.id)}
                        </span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-gray-800/60" />
                    <DropdownMenuItem
                      onClick={() => navigate('/productos')}
                      className="cursor-pointer text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md font-medium"
                    >
                      <Zap className="w-3.5 h-3.5 mr-2" />
                      Ver todos los productos
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/garantia"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute('/garantia')
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                Garantía
              </Link>
              <Link
                to="/contacto"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute('/contacto')
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                Contacto
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Cart button - always visible */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                onClick={() => navigate('/carrito')}
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>

              {/* ==========================================
                  DESKTOP AUTH BUTTONS (visible md and above)
                 ========================================== */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/40 text-gray-300 hover:text-white hover:border-blue-500/30 transition-all duration-200">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center border border-blue-500/20">
                        <span className="text-blue-300 text-xs font-bold">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <span className="hidden lg:block text-sm font-medium">{user?.firstName}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-gray-700/60 shadow-xl shadow-black/40">
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 font-mono">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-800/60" />
                    <DropdownMenuItem
                      onClick={() => navigate('/admin')}
                      className="cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800/70 rounded-md"
                    >
                      Panel de Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-gray-300 hover:text-white hover:bg-gray-800/60 text-sm font-medium"
                  >
                    <User className="w-4 h-4 mr-1.5" />
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Registrarse
                  </Button>
                </div>
              )}

              {/* ==========================================
                  HAMBURGER BUTTON (visible below md only)
                 ========================================== */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMobileMenuOpen}
              >
                {/* Animated hamburger icon */}
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-current rounded-full transform transition-all duration-300 origin-center ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-current rounded-full transition-all duration-200 ${
                      isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-current rounded-full transform transition-all duration-300 origin-center ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            MOBILE MENU PANEL (slides down below header)
           ========================================== */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="bg-gray-900/98 backdrop-blur-xl border-t border-blue-500/10">
            {/* Mobile Navigation Links */}
            <nav className="px-4 py-3 space-y-1" aria-label="Menú móvil">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActiveRoute('/')
                    ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Home className="w-4 h-4" />
                Inicio
              </Link>

              {/* Products with expandable categories */}
              <div>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActiveRoute('/productos') || isActiveRoute('/categoria')
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    Productos
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCategoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expandable categories sub-menu */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isCategoriesOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-4 pl-4 border-l-2 border-blue-500/20 space-y-0.5 py-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/categoria/${category.id}`}
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                      >
                        <span>{category.name}</span>
                        <span className="text-[10px] font-mono text-gray-600 bg-gray-800/60 px-1.5 py-0.5 rounded">
                          {getCategoryProductCount(category.id)}
                        </span>
                      </Link>
                    ))}
                    <Link
                      to="/productos"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 font-medium transition-all duration-200"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Ver todos
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                to="/garantia"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActiveRoute('/garantia')
                    ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Shield className="w-4 h-4" />
                Garantía
              </Link>

              <Link
                to="/contacto"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActiveRoute('/contacto')
                    ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Phone className="w-4 h-4" />
                Contacto
              </Link>
            </nav>

            {/* Divider with electric blue accent */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

            {/* Mobile Auth Section */}
            <div className="px-4 py-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  {/* User info card */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/40 border border-gray-700/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center border border-blue-500/20">
                      <span className="text-blue-300 text-sm font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 font-mono truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/admin');
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-blue-500/20"
                  >
                    Panel de Admin
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                    className="w-full border-gray-700/50 text-gray-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/login');
                    }}
                    variant="outline"
                    className="w-full border-gray-700/50 text-gray-300 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 rounded-xl py-2.5 text-sm font-medium"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/register');
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// Wrapper with products provider
export function PublicLayout() {
  return (
    <ProductsProvider>
      <PublicLayoutContent />
    </ProductsProvider>
  );
}
