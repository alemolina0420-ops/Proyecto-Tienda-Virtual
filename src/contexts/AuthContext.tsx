import React, { createContext, useContext, useCallback } from 'react';
import type { User, LoginCredentials, RegisterData, UserRole } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDeveloper: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  promoteUser: (userId: string, role: UserRole) => void;
  getAllUsers: () => User[];
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default developer account
const defaultDeveloper: User = {
  id: 'dev-001',
  firstName: 'Desarrollador',
  lastName: 'Principal',
  phone: '04120000000',
  email: 'dev@tecnostore.com',
  password: 'DevAdmin2024!',
  role: 'developer',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('currentUser', null);
  const [users, setUsers] = useLocalStorage<User[]>('users', [defaultDeveloper]);
  const [error, setError] = useLocalStorage<string | null>('authError', null);

  const clearError = useCallback(() => setError(null), [setError]);

  const isAdmin = user?.role === 'admin' || user?.role === 'developer';
  const isDeveloper = user?.role === 'developer';

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    clearError();
    const foundUser = users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    } else {
      setError('Correo electrónico o contraseña incorrectos');
      return false;
    }
  }, [users, setUser, setError, clearError]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    clearError();
    
    // Check if email already exists
    if (users.some((u) => u.email === data.email)) {
      setError('Este correo electrónico ya está registrado');
      return false;
    }

    // Check if phone already exists
    if (users.some((u) => u.phone === data.phone)) {
      setError('Este número telefónico ya está registrado');
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      password: data.password,
      role: 'user', // Default role for new registrations
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return true;
  }, [users, setUsers, setUser, setError, clearError]);

  const logout = useCallback(() => {
    setUser(null);
    clearError();
  }, [setUser, clearError]);

  const promoteUser = useCallback((userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  }, [setUsers]);

  const getAllUsers = useCallback(() => {
    return users;
  }, [users]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isDeveloper,
        login,
        register,
        logout,
        promoteUser,
        getAllUsers,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
