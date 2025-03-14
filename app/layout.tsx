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
    <html lang="zh-CN" style={{ height: '100%' }}>
      <head>
        <title>PDF2PIC - PDF转长图工具</title>
        <meta name="description" content="一个简单易用的PDF转长图小工具" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pdf.svg" type="image/svg+xml" />
      </head>
      <body style={{ 
        height: '100%', 
        margin: 0, 
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </body>
    </html>
  );
}
