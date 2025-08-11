'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SiteHeader({ right }: { right?: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur border-b transition-colors ${scrolled ? 'bg-white/80 dark:bg-surface/70 border-border shadow-sm' : 'bg-white/60 dark:bg-surface/40 border-transparent'}`}>
      <div className="mx-auto flex items-center gap-8 px-6 md:px-10 h-16 max-w-6xl">
        <Link href="/" className="font-semibold tracking-tight text-lg">WiderWindow</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/" className="hover:text-brand">Home</Link>
          <Link href="/posts" className="hover:text-brand">Posts</Link>
          <Link href="/admin/new" className="hover:text-brand">New</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {right}
        </div>
      </div>
    </header>
  );
}
