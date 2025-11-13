import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  name: string;
  role: 'plataforma_admin' | 'empresa_admin';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: User['role']) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('easy_admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string, role: User['role']): boolean => {
    if (username.trim() && password.trim()) {
      const name = (username || '').charAt(0).toUpperCase() + (username || '').slice(1);
      const userData: User = { username, name, role };
      setUser(userData);
      localStorage.setItem('easy_admin_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('easy_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
