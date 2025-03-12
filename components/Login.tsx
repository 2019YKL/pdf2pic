'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('请输入密码');
      return;
    }

    const success = login(password);
    
    if (success) {
      onLogin(true);
    } else {
      setError('密码错误，请重试');
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full max-w-md flex-col items-center justify-center">
      <div className="w-full rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">PDF2PIC - 登录</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="mb-2 block font-medium text-gray-700"
            >
              请输入访问密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="输入密码"
            />
          </div>
          
          {error && (
            <p className="mb-4 text-red-500">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
