import { MapPin, Mail, Clock, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProductsProvider, useProducts } from '@/contexts/ProductsContext';

// Inner component
function ContactPageContent() {
  const { siteConfig } = useProducts();
  const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '') || ''}?text=Hola,%20tengo%20una%20consulta`;

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contacto</h1>
          <p className="text-xl text-slate-400">
            Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">WhatsApp</h3>
              <p className="text-slate-400 text-sm mb-4">Respuesta rápida garantizada</p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                {siteConfig.whatsappNumber || 'No configurado'}
              </a>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Correo Electrónico</h3>
              <p className="text-slate-400 text-sm mb-4">Para consultas detalladas</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                {siteConfig.email}
              </a>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Ubicación</h3>
              <p className="text-slate-400 text-sm mb-4">Taller principal</p>
              <span className="text-blue-400 font-medium">{siteConfig.location}</span>
            </CardContent>
          </Card>
        </div>

        {/* Hours */}
        <Card className="bg-slate-900 border-slate-800 mb-12">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Horario de Atención</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-slate-300">Lunes - Viernes</span>
                <span className="text-white font-medium">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-slate-300">Sábados</span>
                <span className="text-white font-medium">9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-slate-300">Domingos</span>
                <span className="text-slate-500">Cerrado</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-slate-300">WhatsApp</span>
                <span className="text-emerald-400 font-medium">24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery zones */}
        <Card className="bg-slate-900 border-slate-800 mb-12">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Zonas de Entrega</h3>
            </div>
            <p className="text-slate-400 mb-4">
              Realizamos entregas personales en las siguientes zonas:
            </p>
            <div className="flex flex-wrap gap-2">
              {siteConfig.deliveryZones.map((zone, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-slate-800 text-slate-300"
                >
                  {zone}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-400 mb-4">¿Listo para hacer tu pedido?</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// Wrapper with provider
export function ContactPage() {
  return (
    <ProductsProvider>
      <ContactPageContent />
    </ProductsProvider>
  );
}
