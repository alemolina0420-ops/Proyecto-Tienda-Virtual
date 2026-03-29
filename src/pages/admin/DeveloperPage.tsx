import { useState, useRef } from 'react';
import { 
  Code, 
  Users, 
  FileJson, 
  Download, 
  Upload, 
  Trash2, 
  Shield, 
  Terminal,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Save,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ProductsProvider, useProducts } from '@/contexts/ProductsContext';
import type { UserRole, SystemLog } from '@/types';

// Inner component
function DeveloperPageContent() {
  const { user, getAllUsers, promoteUser } = useAuth();
  const { siteConfig, updateSiteConfig, logs, clearLogs, exportData, importData } = useProducts();
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'logs' | 'data'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importText, setImportText] = useState('');

  const allUsers = getAllUsers();

  const handlePromoteUser = (userId: string, newRole: UserRole) => {
    promoteUser(userId, newRole);
    toast.success(`Usuario actualizado a ${newRole}`);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tecnostore-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Datos exportados correctamente');
  };

  const handleImport = () => {
    if (!importText.trim()) {
      toast.error('Pega los datos JSON primero');
      return;
    }
    const success = importData(importText);
    if (success) {
      toast.success('Datos importados correctamente');
      setImportText('');
    } else {
      toast.error('Error al importar datos. Verifica el formato JSON');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        toast.success('Datos importados desde archivo');
      } else {
        toast.error('Error al importar archivo');
      }
    };
    reader.readAsText(file);
  };

  const getLogIcon = (type: SystemLog['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'developer':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Desarrollador</Badge>;
      case 'admin':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Administrador</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Usuario</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Code className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Panel de Desarrollador</h1>
          <p className="text-slate-400">Herramientas avanzadas de administración</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'general', label: 'General', icon: Shield },
          { id: 'users', label: 'Usuarios', icon: Users },
          { id: 'logs', label: 'Logs', icon: Terminal },
          { id: 'data', label: 'Datos', icon: FileJson },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Configuraciones del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium text-white">Modo Desarrollador</h4>
                  <p className="text-sm text-slate-400">Muestra información de depuración</p>
                </div>
                <Switch
                  checked={siteConfig.developerMode}
                  onCheckedChange={(checked) => 
                    updateSiteConfig({ developerMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium text-white">Modo Mantenimiento</h4>
                  <p className="text-sm text-slate-400">Muestra página de mantenimiento a usuarios</p>
                </div>
                <Switch
                  checked={siteConfig.maintenanceMode}
                  onCheckedChange={(checked) => 
                    updateSiteConfig({ maintenanceMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium text-white">Permitir Registro</h4>
                  <p className="text-sm text-slate-400">Nuevos usuarios pueden registrarse</p>
                </div>
                <Switch
                  checked={siteConfig.allowRegistration}
                  onCheckedChange={(checked) => 
                    updateSiteConfig({ allowRegistration: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Versión</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Usuario Actual</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rol</span>
                <span className="text-purple-400">{user?.role}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Gestión de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {u.firstName[0]}{u.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{u.firstName} {u.lastName}</p>
                      <p className="text-sm text-slate-400">{u.email}</p>
                      <p className="text-xs text-slate-500">{u.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getRoleBadge(u.role)}
                    {u.id !== user?.id && u.role !== 'developer' && (
                      <select
                        value={u.role}
                        onChange={(e) => handlePromoteUser(u.id, e.target.value as UserRole)}
                        className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs */}
      {activeTab === 'logs' && (
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Logs del Sistema
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
              className="border-slate-700 text-slate-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No hay logs registrados</p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50"
                  >
                    {getLogIcon(log.type)}
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">{log.message}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Management */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                Exportar Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400">
                Descarga una copia de seguridad de todos los datos de la aplicación.
              </p>
              <Button onClick={handleExport} className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Descargar Backup
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                Importar Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400">
                Pega el contenido JSON o selecciona un archivo de backup.
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Pega aquí el JSON..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm font-mono"
              />
              <div className="flex gap-4">
                <Button onClick={handleImport} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Importar desde Texto
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-slate-700 text-slate-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar desde Archivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-red-400">
                <RefreshCw className="w-5 h-5" />
                Restablecer Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400">
                <strong className="text-red-400">¡Advertencia!</strong> Esto eliminará todos los datos y restaurará la configuración inicial.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Restablecer Todo
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Wrapper with providers
export function DeveloperPage() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <DeveloperPageContent />
      </ProductsProvider>
    </AuthProvider>
  );
}
