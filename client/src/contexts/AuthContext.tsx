import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { loginUser, registerUser, getCurrentUser } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Load user from backend if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('civic_token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.user);
        localStorage.setItem('civic_user', JSON.stringify(response.user));
      } catch (err) {
        console.error("Auth restore failed");
        localStorage.removeItem('civic_token');
        localStorage.removeItem('civic_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔥 LOGIN (REAL BACKEND)
 const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await loginUser({ email, password });

    // ✅ STORE TOKEN (CRITICAL)
    localStorage.setItem('civic_token', response.token);
    localStorage.setItem('civic_user', JSON.stringify(response.user));

    setUser(response.user);

  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};

  // 🔥 REGISTER (REAL BACKEND)
  const register = async (data: RegisterData) => {
  setIsLoading(true);
  try {
    const response = await registerUser(data);

    localStorage.setItem('civic_token', response.token);
    localStorage.setItem('civic_user', JSON.stringify(response.user));

    setUser(response.user);
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Registration failed");
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_user');
    localStorage.removeItem('civic_token');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('civic_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useHasRole(role: UserRole | UserRole[]) {
  const { user } = useAuth();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
}