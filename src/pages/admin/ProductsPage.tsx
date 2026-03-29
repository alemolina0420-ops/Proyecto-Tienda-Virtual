import { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, Package, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { useProducts } from '@/contexts/ProductsContext';
import type { Product, ProductSpec } from '@/types';

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  description: string;
  shortDescription: string;
  images: string[];
  features: string;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  specs: ProductSpec[];
}

const initialFormData: ProductFormData = {
  name: '',
  category: '',
  price: '',
  originalPrice: '',
  description: '',
  shortDescription: '',
  images: [],
  features: '',
  inStock: true,
  isNew: false,
  isBestseller: false,
  specs: [],
};

// Componente separado para el formulario de producto
interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  categories: { id: string; name: string }[];
  onSave: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function ProductFormDialog({ isOpen, onClose, editingProduct, categories, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price.toString(),
        originalPrice: editingProduct.originalPrice?.toString() || '',
        description: editingProduct.description,
        shortDescription: editingProduct.shortDescription,
        images: editingProduct.images?.length ? editingProduct.images : ['/placeholder-product.jpg'],
        features: editingProduct.features.join('\n'),
        inStock: editingProduct.inStock,
        isNew: editingProduct.isNew || false,
        isBestseller: editingProduct.isBestseller || false,
        specs: editingProduct.specs || [],
      });
      setCurrentImageIndex(0);
    } else if (open) {
      setFormData(initialFormData);
      setCurrentImageIndex(0);
    }
    if (!open) {
      onClose();
    }
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result as string;
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, newImage] 
        }));
        setCurrentImageIndex(formData.images.length);
      };
      reader.readAsDataURL(file);
    }
  }, [formData.images.length]);

  const handleRemoveImage = useCallback((index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      if (currentImageIndex >= newImages.length) {
        setCurrentImageIndex(Math.max(0, newImages.length - 1));
      }
      return { ...prev, images: newImages };
    });
  }, [currentImageIndex]);

  const handleAddSpec = useCallback(() => {
    if (newSpecLabel.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specs: [...prev.specs, { label: newSpecLabel.trim(), value: newSpecValue.trim() }],
      }));
      setNewSpecLabel('');
      setNewSpecValue('');
    }
  }, [newSpecLabel, newSpecValue]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      description: formData.description,
      shortDescription: formData.shortDescription,
      images: formData.images.length > 0 ? formData.images : ['/placeholder-product.jpg'],
      specs: formData.specs,
      features: formData.features.split('\n').filter((f) => f.trim()),
      inStock: formData.inStock,
      isNew: formData.isNew,
      isBestseller: formData.isBestseller,
    };

    onSave(productData);
    
    // Delay closing to avoid DOM conflicts
    setTimeout(() => {
      onClose();
    }, 100);
  }, [formData, onSave, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Completa todos los datos del producto. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wide">Información Básica</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Nombre *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Nombre del producto"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Precio *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Precio anterior (opcional)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Para mostrar descuento"
                />
              </div>
            </div>
          </div>

          {/* Descripciones */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wide">Descripciones</h3>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Descripción corta *</Label>
              <Input
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Breve descripción para la tarjeta del producto"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Descripción completa *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                placeholder="Descripción detallada del producto"
              />
            </div>
          </div>

          {/* Características */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wide">Características</h3>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Características (una por línea)</Label>
              <Textarea
                value={formData.features}
                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                placeholder="• Característica 1&#10;• Característica 2&#10;• Característica 3"
              />
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wide">Especificaciones Técnicas</h3>
            
            {formData.specs.length > 0 && (
              <div className="space-y-2">
                {formData.specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800">
                    <span className="text-slate-400 font-medium">{spec.label}:</span>
                    <span className="text-white flex-1">{spec.value}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        specs: prev.specs.filter((_, i) => i !== index)
                      }))}
                      className="text-slate-500 hover:text-red-400 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-2">
                <Input
                  value={newSpecLabel}
                  onChange={(e) => setNewSpecLabel(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Etiqueta (ej: Potencia)"
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Valor (ej: 50W)"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSpec}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wide">
              Imágenes del Producto
              <span className="text-slate-500 text-xs normal-case ml-2">
                ({formData.images.length} {formData.images.length === 1 ? 'imagen' : 'imágenes'})
              </span>
            </h3>
            
            <div className="space-y-4">
              {formData.images.length > 0 && (
                <div className="space-y-3">
                  <div className="relative bg-slate-800 rounded-lg overflow-hidden" style={{ height: '250px' }}>
                    <img
                      src={formData.images[currentImageIndex]}
                      alt={`Imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                    
                    {formData.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
                          disabled={currentImageIndex === 0}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-900"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentImageIndex(i => Math.min(formData.images.length - 1, i + 1))}
                          disabled={currentImageIndex === formData.images.length - 1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-900"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {formData.images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                idx === currentImageIndex ? 'bg-amber-400' : 'bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(currentImageIndex)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {formData.images.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {formData.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            idx === currentImageIndex ? 'border-amber-400' : 'border-slate-700'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <label className="flex items-center justify-center gap-2 px-4 py-4 rounded-lg bg-slate-800 border border-dashed border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-700 hover:border-slate-500 transition-colors">
                <ImageIcon className="w-5 h-5" />
                <span>{formData.images.length > 0 ? 'Agregar otra imagen' : 'Subir imagen'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Opciones */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wide">Opciones</h3>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.inStock}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
                />
                <Label className="text-slate-300">En stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isNew}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
                />
                <Label className="text-slate-300">Nuevo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isBestseller}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBestseller: checked }))}
                />
                <Label className="text-slate-300">Popular</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-800">
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
            >
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main component
function ProductsPageContent() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
  }, [editingProduct, updateProduct, addProduct]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    // Delay clearing the editing product to avoid rendering issues
    setTimeout(() => {
      setEditingProduct(null);
    }, 150);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(id);
    }
  }, [deleteProduct]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Productos</h1>
          <p className="text-slate-400 mt-1">Gestiona tu catálogo de productos</p>
        </div>
        <Button onClick={handleAddNew} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Product Form Dialog */}
      <ProductFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingProduct={editingProduct}
        categories={categories}
        onSave={handleSave}
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="border-slate-800 bg-slate-900 overflow-hidden">
            <div className="aspect-square bg-slate-800 relative">
              <img
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images && product.images.length > 1 && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-slate-900/80 text-white text-xs flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {product.images.length}
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-1">
                {product.isNew && (
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/90 text-white">
                    Nuevo
                  </span>
                )}
                {product.isBestseller && (
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-500/90 text-white">
                    Popular
                  </span>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-slate-400 mb-3 line-clamp-2">{product.shortDescription}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-amber-400">${product.price}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-slate-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(product)}
                    className="text-slate-400 hover:text-amber-400"
                    title="Editar producto"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    className="text-slate-400 hover:text-red-400"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-xs text-slate-400">
                  {product.inStock ? 'En stock' : 'Agotado'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
}

export { ProductsPageContent as ProductsPage };
