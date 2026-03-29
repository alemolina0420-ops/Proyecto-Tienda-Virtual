import { Package, Tags, TrendingUp, Users } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DashboardPage() {
  const { products, categories, siteConfig } = useProducts();
  const { user, isDeveloper } = useAuth();

  const stats = [
    {
      title: 'Total Productos',
      value: products.length,
      icon: Package,
      color: 'amber',
    },
    {
      title: 'Categorías',
      value: categories.length,
      icon: Tags,
      color: 'emerald',
    },
    {
      title: 'Productos en Stock',
      value: products.filter((p) => p.inStock).length,
      icon: TrendingUp,
      color: 'blue',
    },
    {
      title: 'Productos Destacados',
      value: products.filter((p) => p.isBestseller || p.isNew).length,
      icon: Users,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          {isDeveloper && (
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              DEV
            </Badge>
          )}
        </div>
        <p className="text-slate-400 mt-1">
          Bienvenido al panel de administración de {siteConfig.brandName}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-800 bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                stat.color === 'amber' ? 'bg-amber-500/10' :
                stat.color === 'emerald' ? 'bg-emerald-500/10' :
                stat.color === 'blue' ? 'bg-blue-500/10' :
                'bg-purple-500/10'
              }`}>
                <stat.icon className={`w-4 h-4 ${
                  stat.color === 'amber' ? 'text-amber-400' :
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  'text-purple-400'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Products */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Productos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50"
              >
                <img
                  src={product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{product.name}</h4>
                  <p className="text-sm text-slate-400">${product.price}</p>
                </div>
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
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.inStock
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {product.inStock ? 'En Stock' : 'Agotado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">Configuración Actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Nombre de la tienda</span>
              <span className="text-white">{siteConfig.brandName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Garantía</span>
              <span className="text-white">{siteConfig.warrantyDays} días</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ubicación</span>
              <span className="text-white">{siteConfig.location}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">Tu Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Nombre</span>
              <span className="text-white">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rol</span>
              <span className={`${
                user?.role === 'developer' ? 'text-purple-400' :
                user?.role === 'admin' ? 'text-amber-400' : 'text-slate-400'
              } capitalize`}>
                {user?.role}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
