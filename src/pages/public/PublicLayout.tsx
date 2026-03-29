import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  User, 
  LogOut, 
  ChevronDown,
  Package,
  Cpu,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { ProductsProvider, useProducts } from '@/contexts/ProductsContext';

// Inner component that uses the contexts
function PublicLayoutContent() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { categories, products, siteConfig } = useProducts();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter((p) => p.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-amber-400" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-white">{siteConfig.brandName}</h1>
                <p className="text-xs text-slate-400">{siteConfig.tagline}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                Inicio
              </Link>
              
              {/* Products Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
                    <Package className="w-4 h-4" />
                    Productos
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-slate-900 border-slate-800">
                  <div className="p-2">
                    <p className="text-xs text-slate-500 px-2 py-1">Categorías</p>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => navigate(`/categoria/${category.id}`)}
                        className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs text-slate-500">
                          {getCategoryProductCount(category.id)}
                        </span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem
                      onClick={() => navigate('/productos')}
                      className="cursor-pointer text-amber-400 hover:text-amber-300 hover:bg-slate-800"
                    >
                      Ver todos los productos
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/garantia" className="text-slate-300 hover:text-white transition-colors">
                Garantía
              </Link>
              <Link to="/contacto" className="text-slate-300 hover:text-white transition-colors">
                Contacto
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Cart button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
                onClick={() => navigate('/carrito')}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>

              {/* Auth buttons */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-emerald-400 text-sm font-medium">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm">{user?.firstName}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border-slate-800">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem
                      onClick={() => navigate('/admin')}
                      className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      Panel de Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-slate-800"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-slate-300 hover:text-white"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="btn-primary"
                  >
                    Registrarse
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-slate-400">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-slate-900 border-slate-800 p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-white">Menú</span>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                      <Link
                        to="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        Inicio
                      </Link>
                      
                      {/* Mobile Categories */}
                      <div className="px-4 py-2">
                        <p className="text-xs text-slate-500 mb-2">Categorías</p>
                        <div className="space-y-1">
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              to={`/categoria/${category.id}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              <span>{category.name}</span>
                              <span className="text-xs text-slate-600">
                                {getCategoryProductCount(category.id)}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <Link
                        to="/productos"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-slate-800"
                      >
                        Ver todos los productos
                      </Link>

                      <div className="border-t border-slate-800 my-2" />

                      <Link
                        to="/garantia"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        Garantía
                      </Link>
                      <Link
                        to="/contacto"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        Contacto
                      </Link>
                    </nav>

                    {/* Mobile Auth */}
                    <div className="p-4 border-t border-slate-800">
                      {isAuthenticated ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                              <span className="text-emerald-400 font-medium">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{user?.firstName} {user?.lastName}</p>
                              <p className="text-xs text-slate-400">{user?.email}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate('/admin');
                            }}
                            className="w-full btn-primary"
                          >
                            Panel de Admin
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full border-slate-700 text-slate-400"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate('/login');
                            }}
                            variant="outline"
                            className="w-full border-slate-700 text-slate-300"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Iniciar Sesión
                          </Button>
                          <Button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate('/register');
                            }}
                            className="w-full btn-primary"
                          >
                            Registrarse
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

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
