import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Check, Package, Shield, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductsProvider, useProducts } from '@/contexts/ProductsContext';

// Inner component
function ProductDetailPageContent() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, categories, siteConfig, getProductById } = useProducts();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = productId ? getProductById(productId) : null;
  const productImages = product?.images || [];

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h2>
          <p className="text-slate-400 mb-6">El producto que buscas no existe o ha sido eliminado</p>
          <button onClick={() => navigate('/productos')} className="btn-primary">
            Ver todos los productos
          </button>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '') || ''}?text=${encodeURIComponent('Hola, deseo comprar el ' + product.name + ' visto en la web')}`;

  const handleNextImage = () => {
    if (currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative">
              <img
                src={productImages[currentImageIndex] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              
              {/* Navigation arrows - only show if multiple images */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-900 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === productImages.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-900 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 text-white text-sm">
                    {currentImageIndex + 1} / {productImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails - only show if multiple images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-amber-400' : 'border-slate-800'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.isNew && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  Nuevo
                </Badge>
              )}
              {product.isBestseller && (
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                  Popular
                </Badge>
              )}
              <Badge
                className={
                  product.inStock
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }
              >
                {product.inStock ? 'En stock' : 'Agotado'}
              </Badge>
              {productImages.length > 1 && (
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {productImages.length} fotos
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-400 mb-2">{category?.name}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{product.name}</h1>
              <p className="text-slate-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-amber-400">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-slate-500 line-through">${product.originalPrice}</span>
              )}
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Características</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {product.specs.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Especificaciones Técnicas</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-500 mb-1">{spec.label}</p>
                      <p className="text-sm font-medium text-white">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty info */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-emerald-400">
                  Garantía de {siteConfig.warrantyDays} días
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Respaldada por {siteConfig.technicianTitle} en {siteConfig.location}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium inline-flex items-center justify-center py-4 rounded-xl gap-3 text-lg transition-colors shadow-lg shadow-emerald-900/20"
              >
                <MessageCircle className="w-5 h-5" />
                Comprar por WhatsApp
              </a>
            </div>

            {/* Delivery zones */}
            <div className="pt-6 border-t border-slate-800">
              <p className="text-sm text-slate-400 mb-3">Zonas de entrega disponibles:</p>
              <div className="flex flex-wrap gap-2">
                {siteConfig.deliveryZones.map((zone, index) => (
                  <span key={index} className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8">Productos Relacionados</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigate(`/producto/${relatedProduct.id}`)}
                  className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all"
                >
                  <div className="aspect-square bg-slate-800 relative overflow-hidden">
                    <img
                      src={relatedProduct.images?.[0] || '/placeholder-product.jpg'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-semibold text-white mb-1 line-clamp-1">{relatedProduct.name}</h3>
                      <p className="text-lg font-bold text-amber-400 mb-2">${relatedProduct.price}</p>
                    </div>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '') || ''}?text=${encodeURIComponent('Hola, deseo comprar el ' + relatedProduct.name + ' visto en la web')}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comprar
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper with provider
export function ProductDetailPage() {
  return (
    <ProductsProvider>
      <ProductDetailPageContent />
    </ProductsProvider>
  );
}
