'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/Login';
import PDFUploader from '@/components/PDFUploader';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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
    setLoading(false);
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      try {
        localStorage.setItem('pdf2pic-auth', 'authenticated');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('无法访问localStorage:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading-indicator">加载中...</span>
      </div>
    );
  }

  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-4">
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="w-full max-w-5xl">
            <h1 className="mb-6 text-center text-3xl font-bold">PDF2PIC - PDF转长图工具</h1>
            <PDFUploader />
          </div>
        )}
      </main>
    </AuthProvider>
  );
}
