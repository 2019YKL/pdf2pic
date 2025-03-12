'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // 检查本地存储中的认证状态
    try {
      const authStatus = localStorage.getItem('pdf2pic-auth');
      if (authStatus === 'authenticated') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('无法访问localStorage:', error);
    }
  }, []);

  const login = (password: string): boolean => {
    // 在实际应用中，这里应该有一个安全的密码验证机制
    // 简化示例，使用硬编码密码
    const correctPassword = 'pdf2pic';
    
    if (password === correctPassword) {
      try {
        localStorage.setItem('pdf2pic-auth', 'authenticated');
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error('无法访问localStorage:', error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    try {
      localStorage.removeItem('pdf2pic-auth');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('无法访问localStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
