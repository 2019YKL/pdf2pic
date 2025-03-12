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
      <div style={{ flex: '1 0 auto' }}>
        <Hero />
      </div>
      <Footer />
    </div>
  )
}
