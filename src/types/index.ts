// User types
export type UserRole = 'user' | 'admin' | 'developer';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  shortDescription: string;
  specs: ProductSpec[];
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// Site config types
export interface SiteConfig {
  brandName: string;
  tagline: string;
  technicianTitle: string;
  location: string;
  warrantyDays: number;
  whatsappNumber: string;
  email: string;
  deliveryZones: string[];
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  primaryColor: string;
  accentColor: string;
  // Developer settings
  developerMode: boolean;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// System logs
export interface SystemLog {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  userId?: string;
}
