import './globals.css';
import type { ReactNode } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Inter, Newsreader } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] });

export const metadata = {
  title: 'WiderWindow Blog',
  description: 'Insights, guides, and resources to widen your perspective.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} h-full font-sans`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:`(function(){try{var k='ww-theme';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';var t=s||m; if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`}} />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors duration-300 relative text-[15px] leading-[1.55]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(37,99,235,0.12),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(29,78,216,0.12),transparent_65%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(79,70,229,0.18),transparent_65%)] dark:opacity-60" />
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader right={<ThemeToggle />} />
          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-6 md:px-10 py-16 md:py-24 space-y-10">{children}</div>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
