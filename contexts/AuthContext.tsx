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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // 默认为已认证状态，绕过密码验证

  useEffect(() => {
    // 自动将用户设置为已认证状态（已屏蔽密码验证功能）
    try {
      localStorage.setItem('pdf2pic-auth', 'authenticated');
    } catch (error) {
      console.error('无法访问localStorage:', error);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    // 屏蔽密码验证功能，直接返回成功
    try {
      // 注释掉原有的密码哈希验证逻辑
      // const hashedPassword = await hashPassword(password);
      
      // 始终返回认证成功（无需密码验证）
      localStorage.setItem('pdf2pic-auth', 'authenticated');
      setIsAuthenticated(true);
      return true;
      
      // 原密码验证逻辑已被屏蔽
      // if (hashedPassword === PASSWORD_HASH) {
      //   localStorage.setItem('pdf2pic-auth', 'authenticated');
      //   setIsAuthenticated(true);
      //   return true;
      // }
      // return false;
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
