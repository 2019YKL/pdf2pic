'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/Login';
import PDFUploader from '@/components/PDFUploader';
import Header from '@/components/Header';
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-slate-600">加载中，请稍候...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      {isAuthenticated && <Header />}
      <main className="flex min-h-screen flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="w-full max-w-7xl animate-fadeIn">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">PDF2PIC</span>
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                简单高效的PDF转长图工具，支持多页PDF拼接和自定义尾部图片
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden p-6">
              <PDFUploader />
            </div>

            <footer className="mt-12 text-center text-slate-500 text-sm">
              <p> {new Date().getFullYear()} PDF2PIC - PDF转长图工具</p>
            </footer>
          </div>
        )}
      </main>
    </AuthProvider>
  );
}
