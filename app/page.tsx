'use client';

import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, rgb(239, 246, 255), white)'
    }}>
      <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Hero />
        {/* 添加渐变背景的空白空间，确保与页面整体视觉一致 */}
        <div style={{ 
          flex: '1 0 auto', 
          minHeight: '100px',
          background: 'linear-gradient(to bottom, white, rgb(249, 250, 251))'
        }}></div>
      </div>
      <Footer />
    </div>
  )
}
