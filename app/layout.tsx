'use client';

import '@/styles/globals.css';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Apply animations when page loads
  useEffect(() => {
    document.body.classList.add('animate-fadeIn');
    return () => {
      document.body.classList.remove('animate-fadeIn');
    };
  }, []);

  return (
    <html lang="zh-CN">
      <head>
        <title>PDF2PIC - PDF转长图工具</title>
        <meta name="description" content="一个简单易用的PDF转长图工具" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}
