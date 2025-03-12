'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-10 w-full bg-white transition-all duration-300 ${
      scrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="font-bold text-xl text-blue-600">PDF2PIC</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-medium rounded-full px-3 py-1">
              PDF转长图工具
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
