import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  adminPassword: string | null;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('isAdmin');
    const storedPassword = localStorage.getItem('adminPassword');
    if (storedAdmin === 'true' && storedPassword) {
      setIsAdmin(true);
      setAdminPassword(storedPassword);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPassword(password);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminPassword', password);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminPassword(null);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminPassword');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, adminPassword, login, logout }}>
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
