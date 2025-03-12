'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The SHA-256 hash of '123456'
// Using a constant hash value instead of plaintext password
const PASSWORD_HASH = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';

// Helper function to hash the password using SHA-256
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

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

  const login = async (password: string): Promise<boolean> => {
    try {
      // Hash the input password and compare with stored hash
      const hashedPassword = await hashPassword(password);
      
      if (hashedPassword === PASSWORD_HASH) {
        localStorage.setItem('pdf2pic-auth', 'authenticated');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('密码验证错误:', error);
      return false;
    }
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
