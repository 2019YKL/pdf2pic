'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('请输入密码');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the async login function
      const success = await login(password);
      
      if (success) {
        onLogin(true);
      } else {
        setError('密码错误，请重试');
        setPassword('');
      }
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      setError('登录过程中发生错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full max-w-md flex-col items-center justify-center p-6">
      <div className="w-full rounded-xl bg-white/80 backdrop-blur-sm p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="15" x2="15" y2="15"></line>
              <line x1="9" y1="18" x2="15" y2="18"></line>
              <line x1="9" y1="12" x2="15" y2="12"></line>
            </svg>
          </div>
        </div>
        
        <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">PDF2PIC</h2>
        <p className="mb-8 text-center text-slate-600">请输入访问密码继续使用</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 pl-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                placeholder=" "
                required
              />
              <label 
                htmlFor="password" 
                className="absolute left-10 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform text-slate-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600"
              >
                访问密码
              </label>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-3.5 text-slate-400">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 shadow-sm border border-red-100 animate-[pulse_1s_ease-in-out]">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all hover:shadow-lg disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2"></div>
                <span>登录中...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span>登录</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
