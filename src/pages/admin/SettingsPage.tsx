import { useState } from 'react';
import { Save, Store, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/contexts/ProductsContext';
import { toast } from 'sonner';

// Inner component
function SettingsPageContent() {
  const { siteConfig, updateSiteConfig } = useProducts();
  const [deliveryZonesInput, setDeliveryZonesInput] = useState(siteConfig.deliveryZones.join('\n'));

  const [formData, setFormData] = useState({
    brandName: siteConfig.brandName,
    tagline: siteConfig.tagline,
    technicianTitle: siteConfig.technicianTitle,
    location: siteConfig.location,
    warrantyDays: siteConfig.warrantyDays,
    whatsappNumber: siteConfig.whatsappNumber,
    email: siteConfig.email,
    heroTitle: siteConfig.heroTitle,
    heroSubtitle: siteConfig.heroSubtitle,
    ctaText: siteConfig.ctaText,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSiteConfig({
      ...formData,
      deliveryZones: deliveryZonesInput.split('\n').filter((z) => z.trim()),
    });

    toast.success('Configuración guardada', {
      description: 'Los cambios se han aplicado correctamente.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
        <p className="text-slate-400 mt-1">Personaliza la información de tu tienda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Settings */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-amber-400" />
              <CardTitle className="text-white">Información de la Marca</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Nombre de la tienda</Label>
                <Input
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Eslogan</Label>
                <Input
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Título del técnico</Label>
              <Input
                value={formData.technicianTitle}
                onChange={(e) => setFormData({ ...formData, technicianTitle: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <CardTitle className="text-white">Contacto</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Número de WhatsApp</Label>
                <Input
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="0412-1234567"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Correo electrónico</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Warranty */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white">Ubicación y Garantía</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Ubicación del taller</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Días de garantía</Label>
                <Input
                  type="number"
                  value={formData.warrantyDays}
                  onChange={(e) => setFormData({ ...formData, warrantyDays: parseInt(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Zonas de entrega (una por línea)</Label>
              <Textarea
                value={deliveryZonesInput}
                onChange={(e) => setDeliveryZonesInput(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                placeholder="Santa Lucía&#10;Charallave&#10;Cúa"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hero Settings */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Configuración del Hero</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Título principal</Label>
              <Input
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Subtítulo</Label>
              <Textarea
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Texto del botón CTA</Label>
              <Input
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}

export { SettingsPageContent as SettingsPage };
