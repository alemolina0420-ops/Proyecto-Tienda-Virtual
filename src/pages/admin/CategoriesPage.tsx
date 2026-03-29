import { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@/contexts/ProductsContext';
import type { Category } from '@/types';

const iconOptions = [
  { value: 'Zap', label: '⚡ Energía' },
  { value: 'Usb', label: '🔌 USB' },
  { value: 'Smartphone', label: '📱 Móvil' },
  { value: 'Headphones', label: '🎧 Audio' },
  { value: 'Shield', label: '🛡️ Protección' },
  { value: 'Package', label: '📦 General' },
  { value: 'Battery', label: '🔋 Batería' },
  { value: 'Monitor', label: '🖥️ Pantalla' },
  { value: 'Cable', label: '🔗 Cable' },
  { value: 'Watch', label: '⌚ Wearable' },
];

interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
}

const initialFormData: CategoryFormData = {
  name: '',
  description: '',
  icon: 'Package',
};

// Componente separado para el formulario de categoría
interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: Category | null;
  onSave: (data: Omit<Category, 'id'>) => void;
}

function CategoryFormDialog({ isOpen, onClose, editingCategory, onSave }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description,
        icon: editingCategory.icon,
      });
    } else if (open) {
      setFormData(initialFormData);
    }
    if (!open) {
      onClose();
    }
  };

  const handleSubmit = useCallback(() => {
    onSave(formData);
    // Delay closing to avoid DOM conflicts
    setTimeout(() => {
      onClose();
    }, 100);
  }, [formData, onSave, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Las categorías ayudan a organizar tu catálogo de productos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Nombre *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Descripción</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Icono</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Seleccionar icono" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {iconOptions.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    {icon.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-300"
            >
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleSubmit}
              className="btn-primary"
              disabled={!formData.name.trim()}
            >
              {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main component
function CategoriesPageContent() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.category === categoryId).length;
  };

  const handleSave = useCallback((categoryData: Omit<Category, 'id'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
  }, [editingCategory, updateCategory, addCategory]);

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    // Delay clearing the editing category to avoid rendering issues
    setTimeout(() => {
      setEditingCategory(null);
    }, 150);
  }, []);

  const handleDelete = useCallback((id: string) => {
    const productCount = getProductCount(id);
    if (productCount > 0) {
      alert(`No puedes eliminar esta categoría porque tiene ${productCount} producto(s) asociado(s).`);
      return;
    }
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      deleteCategory(id);
    }
  }, [deleteCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Categorías</h1>
          <p className="text-slate-400 mt-1">Organiza tus productos por categorías</p>
        </div>
        <Button onClick={handleAddNew} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Categoría
        </Button>
      </div>

      {/* Category Form Dialog */}
      <CategoryFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingCategory={editingCategory}
        onSave={handleSave}
      />

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-slate-400">{category.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {getProductCount(category.id)} producto(s)
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                    className="text-slate-400 hover:text-amber-400"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No hay categorías creadas</p>
        </div>
      )}
    </div>
  );
}

export { CategoriesPageContent as CategoriesPage };
