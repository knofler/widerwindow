export default function SiteFooter() {
  return (
    <footer className="mt-24 pt-16 border-t border-gray-200 dark:border-transparent dark:shadow-[0_-1px_0_0_rgba(255,255,255,0.04)_inset,0_0_0_1px_rgba(0,0,0,0.6)_inset]">
      <div className="mx-auto max-w-6xl px-8 pb-14 text-xs text-gray-500 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} WiderWindow. All rights reserved.</p>
        <nav className="flex gap-6">
          <a href="/" className="hover:text-brand">Home</a>
          <a href="/posts" className="hover:text-brand">Posts</a>
          <a href="/admin/new" className="hover:text-brand">New</a>
        </nav>
      </div>
    </footer>
  );
}
