import { Shield, CheckCircle, Clock, MapPin, MessageCircle } from 'lucide-react';
import { ProductsProvider, useProducts } from '@/contexts/ProductsContext';

// Inner component
function WarrantyPageContent() {
  const { siteConfig } = useProducts();
  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '') || ''}?text=Hola,%20tengo%20una%20consulta%20sobre%20la%20garantía`;

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Nuestra Garantía</h1>
          <p className="text-xl text-slate-400">
            Respaldada por {siteConfig.technicianTitle}
          </p>
        </div>

        {/* Main warranty info */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{siteConfig.warrantyDays} Días de Garantía</h2>
              <p className="text-slate-400">Desde la fecha de entrega</p>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">
            Todos nuestros productos cuentan con garantía real respaldada por taller técnico. 
            No estás comprando a un desconocido de internet: estás adquiriendo productos validados 
            por un {siteConfig.technicianTitle} con respaldo local en {siteConfig.location}.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Cobertura completa</h4>
                <p className="text-sm text-slate-400">Defectos de fábrica y fallas de funcionamiento</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Reemplazo inmediato</h4>
                <p className="text-sm text-slate-400">Si el producto falla, lo reemplazamos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Sin complicaciones</h4>
                <p className="text-sm text-slate-400">Proceso simple y directo</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Soporte técnico</h4>
                <p className="text-sm text-slate-400">Asesoría directa con el técnico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-white mb-4">¿Qué cubre?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Defectos de fabricación</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Fallas de funcionamiento</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Problemas de carga (cargadores)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Incompatibilidad declarada</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-white mb-4">¿Qué NO cubre?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm flex-shrink-0">×</span>
                <span className="text-slate-300">Daños por mal uso</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm flex-shrink-0">×</span>
                <span className="text-slate-300">Daños por agua o líquidos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm flex-shrink-0">×</span>
                <span className="text-slate-300">Desgaste normal por uso</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm flex-shrink-0">×</span>
                <span className="text-slate-300">Modificaciones no autorizadas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Location */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Ubicación y Zonas de Entrega</h3>
          </div>
          <p className="text-slate-300 mb-4">
            <span className="font-medium text-white">Taller principal:</span> {siteConfig.location}
          </p>
          <div className="flex flex-wrap gap-2">
            {siteConfig.deliveryZones.map((zone, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-slate-800 text-slate-300"
              >
                {zone}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-400 mb-4">¿Tienes dudas sobre nuestra garantía?</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// Wrapper with provider
export function WarrantyPage() {
  return (
    <ProductsProvider>
      <WarrantyPageContent />
    </ProductsProvider>
  );
}
