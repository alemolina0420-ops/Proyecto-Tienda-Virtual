import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Cpu, Zap, BatteryCharging, Shield, Thermometer, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsProvider, useProducts } from '@/contexts/ProductsContext';

// Inner component
function LandingPageContent() {
  const navigate = useNavigate();
  const { products, siteConfig } = useProducts();
  const [repairForm, setRepairForm] = useState({ model: '', fault: '', phone: '' });

  const featuredProducts = products.filter((p) => p.isBestseller || p.isNew).slice(0, 4);
  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '') || ''}?text=Hola,%20estoy%20interesado%20en%20sus%20productos`;

  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola, solicito presupuesto técnico.%0AModelo: ${repairForm.model}%0AFalla: ${repairForm.fault}%0ATeléfono: ${repairForm.phone}`;
    const url = `https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '') || ''}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400 tracking-wide">
                {siteConfig.technicianTitle.toUpperCase()} | TALLER {siteConfig.location.split(',')[0].toUpperCase()}
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {siteConfig.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
              {siteConfig.heroSubtitle}
            </p>

            {/* Technical specs */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="tech-term text-sm">Validación Térmica</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="tech-term text-sm">IC Inteligente</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                <BatteryCharging className="w-4 h-4 text-blue-400" />
                <span className="tech-term text-sm">PD 3.0</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3 text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                {siteConfig.ctaText}
              </a>
              <Button
                onClick={() => navigate('/productos')}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 px-8 py-4 text-lg"
              >
                Ver Productos
              </Button>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Garantía de {siteConfig.warrantyDays} días respaldada por taller técnico
            </p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* Why Trust Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Por qué comprar con un <span className="text-amber-400">técnico especializado</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              No es marketing. Cada producto es validado antes de ofrecerlo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                title: 'IC de Carga Inteligente',
                highlight: 'Protocolo PD',
                description: 'Circuitos integrados que negocian el voltaje óptimo, distribuyendo la potencia de manera eficiente sin sobrecargar el sistema térmico.',
                color: 'amber',
              },
              {
                icon: Shield,
                title: 'Protección contra Picos',
                highlight: 'Regulación de Entrada',
                description: 'Protección contra sobretensiones transitorias que estabiliza el voltaje de red antes de convertirlo, evitando daños al dispositivo.',
                color: 'emerald',
              },
              {
                icon: Thermometer,
                title: 'Eficiencia Térmica',
                highlight: 'Pruebas de Laboratorio',
                description: 'Monitoreo de temperatura operativa bajo carga máxima. Materiales de grado industrial que mantienen rangos seguros.',
                color: 'blue',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 card-hover"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  item.color === 'amber' ? 'bg-amber-500/10' :
                  item.color === 'emerald' ? 'bg-emerald-500/10' :
                  'bg-blue-500/10'
                }`}>
                  <item.icon className={`w-7 h-7 ${
                    item.color === 'amber' ? 'text-amber-400' :
                    item.color === 'emerald' ? 'text-emerald-400' :
                    'text-blue-400'
                  }`} />
                </div>

                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  item.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                  item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {item.highlight}
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Productos Destacados</h2>
                <p className="text-slate-400">Los más solicitados por nuestros clientes</p>
              </div>
              <Button
                onClick={() => navigate('/productos')}
                variant="outline"
                className="hidden sm:flex border-slate-700 text-slate-300"
              >
                Ver todos
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/producto/${product.id}`)}
                  className="group cursor-pointer rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden hover:border-amber-500/50 transition-all"
                >
                  <div className="aspect-square bg-slate-700 relative overflow-hidden">
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
                  <div className="p-4 flex flex-col h-[140px] justify-between">
                    <div>
                      <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-lg font-bold text-amber-400">${product.price}</p>
                    </div>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium mt-2 shadow-lg shadow-emerald-900/20"
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reparaciones Section */}
      <section className="py-24 bg-slate-900 border-t border-slate-800 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="text-center mb-10 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                ¿Tu equipo falla? <span className="text-emerald-400">Servicio y Reparaciones</span>
              </h2>
              <p className="text-slate-400">
                Soluciones rápidas y con garantía. Describe tu problema detalladamente para poder ofrecerte un presupuesto de reparación por WhatsApp.
              </p>
            </div>

            <form onSubmit={handleRepairSubmit} className="space-y-6 relative z-10 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">1. Modelo exacto del equipo <span className="text-amber-500">*</span></label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Ej: iPhone 13 Pro, Xiaomi Poco X3..."
                  value={repairForm.model}
                  onChange={(e) => setRepairForm({...repairForm, model: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">2. Descripción de la falla <span className="text-amber-500">*</span></label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Ej: No carga, se apaga solo, la pantalla está rota..."
                  value={repairForm.fault}
                  onChange={(e) => setRepairForm({...repairForm, fault: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">3. Teléfono de contacto <span className="text-amber-500">*</span></label>
                <input 
                  required
                  type="tel" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Ej: 0412-1234567"
                  value={repairForm.phone}
                  onChange={(e) => setRepairForm({...repairForm, phone: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 text-lg rounded-xl shadow-lg shadow-emerald-900/20">
                Solicitar Presupuesto Técnico
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">GARANTÍA REAL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Garantía de <span className="text-emerald-400">{siteConfig.warrantyDays} días</span> respaldada por taller técnico
              </h2>

              <p className="text-lg text-slate-300 leading-relaxed">
                No estás comprando a un desconocido de internet. Estás adquiriendo un producto validado por un técnico especializado, con respaldo local real.
              </p>

              <p className="text-slate-400 leading-relaxed">
                Si hay cualquier comportamiento anómalo en el funcionamiento, tienes contacto directo con el técnico. Cada producto es una validación de nuestra reputación profesional.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 text-sm">Validación técnica</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 text-sm">Taller en {siteConfig.location.split(',')[0]}</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {siteConfig.deliveryZones.map((zone, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-300">{zone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-8">
            <Shield className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Tu dispositivo merece accesorios <span className="text-amber-400">validados por un profesional</span>
          </h2>

          <p className="text-xl text-slate-300 mb-8">
            No expongas tu inversión a hardware que no ha sido verificado térmicamente.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3 text-lg"
          >
            <MessageCircle className="w-5 h-5" />
            {siteConfig.ctaText}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{siteConfig.brandName}</h3>
                  <p className="text-xs text-slate-400">{siteConfig.tagline}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Validación técnica de accesorios para dispositivos móviles.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Productos</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/productos')} className="hover:text-amber-400">Todos los productos</button></li>
                <li><button onClick={() => navigate('/productos')} className="hover:text-amber-400">Nuevos</button></li>
                <li><button onClick={() => navigate('/productos')} className="hover:text-amber-400">Populares</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Información</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/garantia')} className="hover:text-amber-400">Garantía</button></li>
                <li><button onClick={() => navigate('/contacto')} className="hover:text-amber-400">Contacto</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Ubicación y Contacto</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">📍</span>
                  <span>Operamos desde <strong>Santa Lucía del Tuy</strong>, con entregas personales en <strong>Charallave</strong> y <strong>Santa Teresa</strong>.</span>
                </li>
                <li>{siteConfig.whatsappNumber}</li>
                <li>{siteConfig.email}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} {siteConfig.brandName}. {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-400 shadow-sm" title="Ghost Signature - Sello de Validez">
              <span>Sello de Garantía Técnica</span>
              <span className="text-lg drop-shadow-md pb-1 animate-pulse">👻</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrapper with provider
export function LandingPage() {
  return (
    <ProductsProvider>
      <LandingPageContent />
    </ProductsProvider>
  );
}
