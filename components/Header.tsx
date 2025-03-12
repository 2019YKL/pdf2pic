'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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
    <header className={`sticky top-0 z-50 w-full transition-all [duration:300ms]`}>
      <nav aria-label="Global" className="flex items-center justify-between [padding:1.5rem] lg:[padding-inline:2rem]">
        <div className="flex lg:[flex:1]">
          <Link href="/" className="[margin:-1.5rem] [padding:1.5rem]">
            <span className="sr-only">PDF2PIC</span>
            <Image 
              src="/pdf.svg" 
              alt="PDF Icon" 
              width={32} 
              height={32}
            />
          </Link>
        </div>
        <div className="hidden lg:[display:flex] lg:[flex:1] lg:justify-end">
          <Link href="/app" className="text-sm font-semibold [line-height:1.5rem] text-gray-900">
            回到首页 <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
