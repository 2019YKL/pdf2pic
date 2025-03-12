'use client';

import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100vh] [background:linear-gradient(to_bottom,rgb(239,246,255),white)]">
      <div className="flex-[1_0_auto] flex flex-col">
        <Hero />
        {/* 添加渐变背景的空白空间，确保与页面整体视觉一致 */}
        <div className="flex-[1_0_auto] min-h-[100px] [background:linear-gradient(to_bottom,white,rgb(249,250,251))]"></div>
      </div>
      <Footer />
    </div>
  )
}
