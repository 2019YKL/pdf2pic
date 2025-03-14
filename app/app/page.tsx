'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PDFUploader from '@/components/PDFUploader';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AppPage() {
  // 默认设置为已认证状态，不需要密码验证
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // 自动将用户设置为已认证状态（已屏蔽密码验证功能）
    try {
      localStorage.setItem('pdf2pic-auth', 'authenticated');
    } catch (error) {
      console.error('无法访问localStorage:', error);
    }
    setLoading(false);
  }, []);

  // 保留此函数以防其他组件仍需调用，但总是返回成功
  const handleLogin = (success: boolean) => {
    try {
      localStorage.setItem('pdf2pic-auth', 'authenticated');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('无法访问localStorage:', error);
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
      <Header />
      <main className="relative isolate flex min-h-screen flex-col items-center [padding-block:2rem] [padding-inline:1rem] sm:[padding-inline:1.5rem] lg:[padding-inline:2rem]">
        {/* 顶部背景元素 */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 [top:-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:[top:-20rem]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] [width:36.125rem] [transform:translateX(-50%)] rotate-[30deg] [background:linear-gradient(to_right_top,#ff80b5,#9089fc)] opacity-30 sm:left-[calc(50%-30rem)] sm:[width:72.1875rem]"
          />
        </div>
        
        {/* 移除了条件判断，直接显示 PDF 处理工具 */}
        <div className="w-full max-w-7xl animate-fadeIn">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              <span className="text-blue-600">PDF2PIC</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              简单高效的PDF转长图工具，支持多页PDF拼接和自定义尾部图片
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden p-6">
            <PDFUploader />
          </div>

          <footer className="mt-12 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} PDF2PIC - PDF转长图工具</p>
          </footer>
        </div>
        
        {/* 底部背景元素 */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] [width:36.125rem] [transform:translateX(-50%)] [background:linear-gradient(to_right_top,#ff80b5,#9089fc)] opacity-30 sm:left-[calc(50%+36rem)] sm:[width:72.1875rem]"
          />
        </div>
      </main>
    </AuthProvider>
  );
}
