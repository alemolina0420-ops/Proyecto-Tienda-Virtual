import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Grid3X3, List, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductsProvider, useProducts } from '@/contexts/ProductsContext';

// Inner component
function ProductsPageContent() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { products, categories, siteConfig } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentCategory = categoryId ? categories.find((c) => c.id === categoryId) : null;

  let filteredProducts = products;

  // Filter by category
  if (categoryId) {
    filteredProducts = filteredProducts.filter((p) => p.category === categoryId);
  }

  // Filter by search
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {currentCategory ? currentCategory.name : 'Todos los Productos'}
          </h1>
          <p className="text-slate-400">
            {currentCategory
              ? currentCategory.description
              : `Catálogo completo de productos validados por ${siteConfig.technicianTitle}`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={!categoryId ? 'default' : 'outline'}
            onClick={() => navigate('/productos')}
            className={!categoryId ? 'btn-primary' : 'border-slate-700 text-slate-300'}
            size="sm"
          >
            Todos
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={categoryId === cat.id ? 'default' : 'outline'}
              onClick={() => navigate(`/categoria/${cat.id}`)}
              className={categoryId === cat.id ? 'btn-primary' : 'border-slate-700 text-slate-300'}
              size="sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {filteredProducts.map((product) =>
              viewMode === 'grid' ? (
                <div
                  key={product.id}
                  onClick={() => navigate(`/producto/${product.id}`)}
                  className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all"
                >
                  <div className="aspect-square bg-slate-800 relative overflow-hidden">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                      decoding="async"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 px-2 py-1 text-xs rounded-full bg-emerald-500 text-white shadow-md">
                        Nuevo
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-amber-500 text-white shadow-md">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">{product.shortDescription}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-bold text-amber-400">${product.price}</span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-slate-500 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            product.inStock
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {product.inStock ? 'En stock' : 'Agotado'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '') || ''}?text=${encodeURIComponent('Hola, deseo comprar el ' + product.name + ' visto en la web')}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comprar por WhatsApp
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={product.id}
                  onClick={() => navigate(`/producto/${product.id}`)}
                  className="group cursor-pointer flex gap-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all"
                >
                  <div className="w-32 h-32 flex-shrink-0 rounded-xl bg-slate-800 overflow-hidden">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                        <p className="text-sm text-slate-400 mb-2">{product.shortDescription}</p>
                        <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-xl font-bold text-amber-400">${product.price}</span>
                        {product.originalPrice && (
                          <p className="text-sm text-slate-500 line-through">${product.originalPrice}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-default">
                      <div className="flex items-center gap-2">
                        {product.isNew && (
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400">
                            Nuevo
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400">
                            Popular
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            product.inStock
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {product.inStock ? 'En stock' : 'Agotado'}
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '') || ''}?text=${encodeURIComponent('Hola, deseo comprar el ' + product.name + ' visto en la web')}`, '_blank');
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper with provider
export function ProductsPage() {
  return (
    <ProductsProvider>
      <ProductsPageContent />
    </ProductsProvider>
  );
}
