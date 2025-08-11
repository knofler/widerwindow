'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const STORAGE_KEY = 'ww-theme';
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>(() => 'light');

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as 'light'|'dark'|null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved || (prefersDark ? 'dark' : 'light');
      setTheme(initial);
      if (initial === 'dark') document.documentElement.classList.add('dark');
    } catch {}
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    const root = document.documentElement.classList;
    if (next === 'dark') root.add('dark'); else root.remove('dark');
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-xs rounded-md border px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:border-border dark:hover:bg-surface/60 transition"
    >
      {mounted ? (theme === 'dark' ? 'Light' : 'Dark') : '...'}
    </button>
  );
}
