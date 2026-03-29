import React, { createContext, useContext, useCallback } from 'react';
import type { Product, Category, SiteConfig, SystemLog } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ProductsContextType {
  products: Product[];
  categories: Category[];
  siteConfig: SiteConfig;
  logs: SystemLog[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  addLog: (log: Omit<SystemLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const defaultSiteConfig: SiteConfig = {
  brandName: 'TecnoStore',
  tagline: 'Técnico Especializado en Dispositivos Móviles',
  technicianTitle: 'Técnico Especializado en Dispositivos Móviles',
  location: 'Santa Lucía, Valles del Tuy',
  warrantyDays: 15,
  whatsappNumber: '',
  email: 'contacto@tecnostore.com',
  deliveryZones: ['Santa Lucía', 'Charallave', 'Cúa', 'Ocumare del Tuy', 'Zonas aledañas'],
  heroTitle: '¿Tu dispositivo merece accesorios que no han sido validados térmicamente?',
  heroSubtitle: 'Soy Técnico Especializado en Dispositivos Móviles con taller de servicio en Santa Lucía. Cada producto es validado antes de ofrecerlo.',
  ctaText: 'Quiero proteger mi inversión',
  primaryColor: '#f59e0b',
  accentColor: '#10b981',
  // Developer settings
  developerMode: false,
  maintenanceMode: false,
  allowRegistration: true,
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Cargadores', icon: 'Zap', description: 'Cargadores certificados y validados' },
  { id: '2', name: 'Cables', icon: 'Usb', description: 'Cables de alta durabilidad' },
  { id: '3', name: 'Audífonos', icon: 'Headphones', description: 'Audio de calidad profesional' },
  { id: '4', name: 'Accesorios', icon: 'Package', description: 'Otros accesorios esenciales' },
  { id: '5', name: 'Herramientas', icon: 'Shield', description: 'Herramientas de precisión' },
  { id: '6', name: 'Almacenamiento', icon: 'Monitor', description: 'Cases y dispositivos de almacenamiento' },
  { id: '7', name: 'Domótica', icon: 'Battery', description: 'Cámaras y dispositivos inteligentes' },
  { id: '8', name: 'Consumibles', icon: 'Package', description: 'Productos de uso general' },
];

const defaultProducts: Product[] = [
  {
    id: 'CARG0208',
    name: 'Cargador 2 en 1 Tecno 33W Tipo C UI80XEE',
    category: '1',
    price: 3.00,
    images: ['/placeholder-product.jpg'],
    description: 'Cargador dual 2 en 1 para dispositivos Tecno con 33W de potencia. Puerto Tipo C con protocolo de carga rápida.',
    shortDescription: 'Cargador 33W 2 en 1 para Tecno con puerto Tipo C',
    specs: [
      { label: 'Potencia', value: '33W' },
      { label: 'Puertos', value: '2 en 1' },
      { label: 'Conector', value: 'Tipo C' },
      { label: 'Modelo', value: 'UI80XEE' },
      { label: 'Compatibilidad', value: 'Tecno' },
    ],
    features: [
      'Carga rápida 33W',
      'Diseño 2 en 1 versátil',
      'Compatible con dispositivos Tecno',
      'Validado térmicamente',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CARG0207',
    name: 'Cargador 2 en 1 Infinix 33W Tipo C UI80XEE',
    category: '1',
    price: 3.00,
    images: ['/placeholder-product.jpg'],
    description: 'Cargador dual 2 en 1 para dispositivos Infinix con 33W de potencia. Puerto Tipo C con carga rápida.',
    shortDescription: 'Cargador 33W 2 en 1 para Infinix con puerto Tipo C',
    specs: [
      { label: 'Potencia', value: '33W' },
      { label: 'Puertos', value: '2 en 1' },
      { label: 'Conector', value: 'Tipo C' },
      { label: 'Modelo', value: 'UI80XEE' },
      { label: 'Compatibilidad', value: 'Infinix' },
    ],
    features: [
      'Carga rápida 33W',
      'Diseño 2 en 1 versátil',
      'Compatible con dispositivos Infinix',
      'Validado térmicamente',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'AUPO0341',
    name: 'Audífono Inalámbrico A9 Pro Touch',
    category: '3',
    price: 11.00,
    images: ['/placeholder-product.jpg'],
    description: 'Audífonos inalámbricos A9 Pro con control táctil. Sonido de alta calidad y batería de larga duración.',
    shortDescription: 'Audífonos inalámbricos A9 Pro con control touch',
    specs: [
      { label: 'Modelo', value: 'A9 Pro Touch' },
      { label: 'Conectividad', value: 'Bluetooth' },
      { label: 'Control', value: 'Táctil' },
      { label: 'Tipo', value: 'Inalámbrico' },
    ],
    features: [
      'Control táctil intuitivo',
      'Conexión Bluetooth estable',
      'Sonido de alta fidelidad',
      'Diseño ergonómico',
    ],
    inStock: true,
    isNew: true,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CARG0212',
    name: 'Cargador 2 en 1 iPhone 15 Pro Max 50W',
    category: '1',
    price: 5.50,
    images: ['/cargador-hero.jpg'],
    description: 'Cargador dual USB-C con 50W de potencia total para iPhone 15 Pro Max. Validado térmicamente con IC de carga inteligente.',
    shortDescription: 'Cargador 50W 2 en 1 para iPhone 15 Pro Max',
    specs: [
      { label: 'Potencia', value: '50W' },
      { label: 'Puertos', value: '2 en 1' },
      { label: 'Conector', value: 'USB-C' },
      { label: 'Compatibilidad', value: 'iPhone 15 Pro Max' },
      { label: 'IC de Carga', value: 'Inteligente' },
    ],
    features: [
      'Carga rápida 50W',
      'IC de carga inteligente',
      'Validado térmicamente',
      'Protección multicapa',
    ],
    inStock: true,
    isNew: true,
    isBestseller: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CARG0213',
    name: 'Cargador 2 en 1 iPhone 15 Pro Max 35W',
    category: '1',
    price: 4.80,
    images: ['/placeholder-product.jpg'],
    description: 'Cargador dual 2 en 1 para iPhone 15 Pro Max con 35W de potencia. Compatible con carga rápida.',
    shortDescription: 'Cargador 35W 2 en 1 para iPhone 15 Pro Max',
    specs: [
      { label: 'Potencia', value: '35W' },
      { label: 'Puertos', value: '2 en 1' },
      { label: 'Conector', value: 'USB-C' },
      { label: 'Compatibilidad', value: 'iPhone 15 Pro Max' },
    ],
    features: [
      'Carga rápida 35W',
      'Diseño compacto',
      'Compatible iPhone 15 Pro Max',
      'Validado térmicamente',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ACCE0194',
    name: 'Micrófono Balita Inalámbrico Combo K11',
    category: '4',
    price: 6.60,
    images: ['/placeholder-product.jpg'],
    description: 'Micrófono inalámbrico de solapa tipo balita Combo K11. Ideal para grabación de video y streaming.',
    shortDescription: 'Micrófono inalámbrico de solapa Combo K11',
    specs: [
      { label: 'Modelo', value: 'Combo K11' },
      { label: 'Tipo', value: 'Balita / Solapa' },
      { label: 'Conectividad', value: 'Inalámbrico' },
      { label: 'Uso', value: 'Video, Streaming' },
    ],
    features: [
      'Conexión inalámbrica estable',
      'Sonido claro y nítido',
      'Fácil de usar',
      'Ideal para creadores de contenido',
    ],
    inStock: true,
    isNew: true,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CABL0237',
    name: 'Cable USB-C a Lightning Silicon 2 en 1',
    category: '2',
    price: 1.80,
    images: ['/placeholder-product.jpg'],
    description: 'Cable 2 en 1 con conectores USB-C y Lightning. Fabricado en silicona para mayor durabilidad.',
    shortDescription: 'Cable 2 en 1 USB-C/Lightning de silicona',
    specs: [
      { label: 'Conectores', value: 'USB-C / Lightning' },
      { label: 'Tipo', value: '2 en 1' },
      { label: 'Material', value: 'Silicona' },
      { label: 'Función', value: 'Carga y datos' },
    ],
    features: [
      'Diseño 2 en 1 versátil',
      'Material de silicona duradero',
      'Compatible múltiples dispositivos',
      'Resistente a enredos',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'AUPO0364',
    name: 'Audífonos In Ear QKZ SK8 Monitor',
    category: '3',
    price: 4.50,
    images: ['/placeholder-product.jpg'],
    description: 'Audífonos in-ear QKZ SK8 tipo monitor. Sonido profesional con aislamiento de ruido.',
    shortDescription: 'Audífonos in-ear QKZ SK8 Monitor profesional',
    specs: [
      { label: 'Modelo', value: 'QKZ SK8' },
      { label: 'Tipo', value: 'In-Ear Monitor' },
      { label: 'Conexión', value: 'Cable 3.5mm' },
      { label: 'Uso', value: 'Audio profesional' },
    ],
    features: [
      'Sonido de monitor profesional',
      'Aislamiento de ruido',
      'Calidad de audio superior',
      'Diseño ergonómico',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CARG0102',
    name: 'Cargador Adaptador para Tablet y Laptop 12-24V',
    category: '1',
    price: 5.60,
    images: ['/placeholder-product.jpg'],
    description: 'Cargador adaptador universal para tablets y laptops. Voltaje ajustable 12-24V.',
    shortDescription: 'Adaptador universal 12-24V para tablet y laptop',
    specs: [
      { label: 'Voltaje', value: '12-24V' },
      { label: 'Uso', value: 'Tablet y Laptop' },
      { label: 'Tipo', value: 'Adaptador universal' },
      { label: 'Ajustable', value: 'Sí' },
    ],
    features: [
      'Voltaje ajustable 12-24V',
      'Compatible con múltiples dispositivos',
      'Ideal para tablets y laptops',
      'Diseño portátil',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'AUPO0394',
    name: 'Audífono Inalámbrico Ambie',
    category: '3',
    price: 9.00,
    images: ['/placeholder-product.jpg'],
    description: 'Audífonos inalámbricos Ambie con diseño moderno. Conexión Bluetooth y sonido de calidad.',
    shortDescription: 'Audífonos inalámbricos Ambie Bluetooth',
    specs: [
      { label: 'Modelo', value: 'Ambie' },
      { label: 'Conectividad', value: 'Bluetooth' },
      { label: 'Tipo', value: 'Inalámbrico' },
      { label: 'Diseño', value: 'Moderno' },
    ],
    features: [
      'Conexión Bluetooth estable',
      'Diseño moderno y elegante',
      'Sonido de alta calidad',
      'Batería de larga duración',
    ],
    inStock: true,
    isNew: true,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CABL0198',
    name: 'Cable Xiaomi Tipo C a C',
    category: '2',
    price: 1.30,
    images: ['/placeholder-product.jpg'],
    description: 'Cable original Xiaomi Tipo C a C. Compatible con carga rápida y transferencia de datos.',
    shortDescription: 'Cable Xiaomi Tipo C a C original',
    specs: [
      { label: 'Marca', value: 'Xiaomi' },
      { label: 'Conectores', value: 'Tipo C a C' },
      { label: 'Función', value: 'Carga y datos' },
      { label: 'Tipo', value: 'Original' },
    ],
    features: [
      'Cable original Xiaomi',
      'Soporta carga rápida',
      'Transferencia de datos',
      'Alta durabilidad',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CABL0213',
    name: 'Cable Samsung Tipo C-C 3A',
    category: '2',
    price: 1.40,
    images: ['/placeholder-product.jpg'],
    description: 'Cable Samsung Tipo C a C con soporte para 3A de corriente. Carga rápida garantizada.',
    shortDescription: 'Cable Samsung Tipo C-C 3A carga rápida',
    specs: [
      { label: 'Marca', value: 'Samsung' },
      { label: 'Conectores', value: 'Tipo C a C' },
      { label: 'Corriente', value: '3A' },
      { label: 'Carga', value: 'Rápida' },
    ],
    features: [
      'Soporta hasta 3A',
      'Carga rápida',
      'Compatible Samsung',
      'Alta calidad',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'HERR0062',
    name: 'Kit de Destornilladores de Precisión BA-3338',
    category: '5',
    price: 12.00,
    images: ['/placeholder-product.jpg'],
    description: 'Kit completo de destornilladores de precisión modelo BA-3338. Ideal para reparación de dispositivos móviles.',
    shortDescription: 'Kit destornilladores de precisión BA-3338',
    specs: [
      { label: 'Modelo', value: 'BA-3338' },
      { label: 'Tipo', value: 'Precisión' },
      { label: 'Uso', value: 'Reparación móviles' },
      { label: 'Incluye', value: 'Set completo' },
    ],
    features: [
      'Set completo de puntas',
      'Ideal para reparaciones',
      'Alta precisión',
      'Estuche organizador incluido',
    ],
    inStock: true,
    isNew: true,
    isBestseller: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CABL0168',
    name: 'Cable USB iPhone (1M)',
    category: '2',
    price: 1.00,
    images: ['/placeholder-product.jpg'],
    description: 'Cable USB para iPhone de 1 metro de longitud. Compatible con carga y sincronización de datos.',
    shortDescription: 'Cable USB para iPhone 1 metro',
    specs: [
      { label: 'Longitud', value: '1 metro' },
      { label: 'Conector', value: 'Lightning' },
      { label: 'Función', value: 'Carga y datos' },
      { label: 'Compatible', value: 'iPhone' },
    ],
    features: [
      'Longitud de 1 metro',
      'Carga y sincronización',
      'Compatible iPhone',
      'Precio accesible',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'AUPO0260',
    name: 'Audífono Inalámbrico AirPods Pro',
    category: '3',
    price: 10.00,
    images: ['/placeholder-product.jpg'],
    description: 'Audífonos inalámbricos estilo AirPods Pro. Sonido de alta calidad con cancelación de ruido.',
    shortDescription: 'Audífonos inalámbricos AirPods Pro style',
    specs: [
      { label: 'Tipo', value: 'Inalámbrico' },
      { label: 'Estilo', value: 'AirPods Pro' },
      { label: 'Conectividad', value: 'Bluetooth' },
      { label: 'Característica', value: 'Cancelación de ruido' },
    ],
    features: [
      'Diseño tipo AirPods Pro',
      'Sonido de alta calidad',
      'Conexión Bluetooth',
      'Cancelación de ruido',
    ],
    inStock: true,
    isNew: true,
    isBestseller: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'COMP0011',
    name: 'Case Externo 2.5 HDD-SSD Tipo C',
    category: '6',
    price: 5.50,
    images: ['/placeholder-product.jpg'],
    description: 'Case externo para discos duros HDD y SSD de 2.5 pulgadas. Conexión Tipo C de alta velocidad.',
    shortDescription: 'Case externo 2.5" HDD/SSD con Tipo C',
    specs: [
      { label: 'Tamaño', value: '2.5 pulgadas' },
      { label: 'Compatible', value: 'HDD y SSD' },
      { label: 'Conexión', value: 'Tipo C' },
      { label: 'Tipo', value: 'Case externo' },
    ],
    features: [
      'Compatible HDD y SSD',
      'Conexión Tipo C rápida',
      'Tamaño 2.5 pulgadas',
      'Fácil instalación',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'COMP0010',
    name: 'Case Externo 2.5 HDD Tipo C',
    category: '6',
    price: 4.20,
    images: ['/placeholder-product.jpg'],
    description: 'Case externo para discos duros HDD de 2.5 pulgadas. Conexión Tipo C USB 3.0.',
    shortDescription: 'Case externo 2.5" HDD con Tipo C',
    specs: [
      { label: 'Tamaño', value: '2.5 pulgadas' },
      { label: 'Compatible', value: 'HDD' },
      { label: 'Conexión', value: 'Tipo C USB 3.0' },
      { label: 'Tipo', value: 'Case externo' },
    ],
    features: [
      'Para discos HDD 2.5"',
      'Conexión Tipo C USB 3.0',
      'Alta velocidad',
      'Diseño compacto',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ACCE0224',
    name: 'Cinta Colgante para Teléfonos',
    category: '4',
    price: 1.30,
    images: ['/placeholder-product.jpg'],
    description: 'Cinta colgante para teléfonos móviles. Ideal para llevar tu dispositivo de forma segura.',
    shortDescription: 'Cinta colgante para teléfonos móviles',
    specs: [
      { label: 'Uso', value: 'Teléfonos móviles' },
      { label: 'Tipo', value: 'Colgante' },
      { label: 'Función', value: 'Seguridad' },
    ],
    features: [
      'Diseño práctico',
      'Evita caídas',
      'Fácil de usar',
      'Compatible universal',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'OTRO0003',
    name: 'Llaveros Acrílicos Campanita Mix',
    category: '4',
    price: 0.70,
    images: ['/placeholder-product.jpg'],
    description: 'Llaveros acrílicos con diseño de campanita. Pack mixto con varios diseños.',
    shortDescription: 'Llaveros acrílicos campanita mix',
    specs: [
      { label: 'Material', value: 'Acrílico' },
      { label: 'Diseño', value: 'Campanita' },
      { label: 'Tipo', value: 'Mix' },
    ],
    features: [
      'Material acrílico',
      'Diseño campanita',
      'Varios modelos',
      'Precio accesible',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'CONS0004',
    name: 'Gel Multiuso Yaxun Y-3000 (110ml)',
    category: '8',
    price: 3.40,
    images: ['/placeholder-product.jpg'],
    description: 'Gel multiuso Yaxun Y-3000 de 110ml. Ideal para reparaciones y mantenimiento de dispositivos.',
    shortDescription: 'Gel multiuso Yaxun Y-3000 110ml',
    specs: [
      { label: 'Marca', value: 'Yaxun' },
      { label: 'Modelo', value: 'Y-3000' },
      { label: 'Capacidad', value: '110ml' },
      { label: 'Tipo', value: 'Multiuso' },
    ],
    features: [
      'Uso multiuso',
      'Ideal para reparaciones',
      'Marca Yaxun',
      'Presentación 110ml',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'DOMO0001',
    name: 'Cámara 360 FHD Doble V380 Pro',
    category: '7',
    price: 14.50,
    images: ['/placeholder-product.jpg'],
    description: 'Cámara de seguridad 360° FHD con doble lente. Modelo V380 Pro con visión panorámica.',
    shortDescription: 'Cámara 360° FHD doble lente V380 Pro',
    specs: [
      { label: 'Resolución', value: 'FHD' },
      { label: 'Ángulo', value: '360°' },
      { label: 'Lentes', value: 'Doble' },
      { label: 'Modelo', value: 'V380 Pro' },
    ],
    features: [
      'Visión 360° completa',
      'Doble lente',
      'Resolución FHD',
      'Ideal para seguridad',
    ],
    inStock: true,
    isNew: true,
    isBestseller: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', defaultProducts);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);
  const [siteConfig, setSiteConfig] = useLocalStorage<SiteConfig>('siteConfig', defaultSiteConfig);
  const [logs, setLogs] = useLocalStorage<SystemLog[]>('systemLogs', []);

  const addLog = useCallback((log: Omit<SystemLog, 'id' | 'timestamp'>) => {
    const newLog: SystemLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Keep only last 100 logs
  }, [setLogs]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, newProduct]);
    addLog({ type: 'success', message: `Producto creado: ${product.name}` });
  }, [setProducts, addLog]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
    addLog({ type: 'info', message: `Producto actualizado: ID ${id}` });
  }, [setProducts, addLog]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addLog({ type: 'warning', message: `Producto eliminado: ID ${id}` });
  }, [setProducts, addLog]);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    addLog({ type: 'success', message: `Categoría creada: ${category.name}` });
  }, [setCategories, addLog]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addLog({ type: 'info', message: `Categoría actualizada: ID ${id}` });
  }, [setCategories, addLog]);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addLog({ type: 'warning', message: `Categoría eliminada: ID ${id}` });
  }, [setCategories, addLog]);

  const updateSiteConfig = useCallback((updates: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({ ...prev, ...updates }));
    addLog({ type: 'info', message: 'Configuración del sitio actualizada' });
  }, [setSiteConfig, addLog]);

  const getProductById = useCallback((id: string) => {
    return products.find((p) => p.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((categoryId: string) => {
    return products.filter((p) => p.category === categoryId);
  }, [products]);

  const exportData = useCallback(() => {
    const data = {
      products,
      categories,
      siteConfig,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [products, categories, siteConfig]);

  const importData = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.products) setProducts(data.products);
      if (data.categories) setCategories(data.categories);
      if (data.siteConfig) setSiteConfig(data.siteConfig);
      addLog({ type: 'success', message: 'Datos importados correctamente' });
      return true;
    } catch (error) {
      addLog({ type: 'error', message: 'Error al importar datos' });
      return false;
    }
  }, [setProducts, setCategories, setSiteConfig, addLog]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        siteConfig,
        logs,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSiteConfig,
        getProductById,
        getProductsByCategory,
        addLog,
        clearLogs,
        exportData,
        importData,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
