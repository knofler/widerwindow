export default function SiteFooter() {
  return (
    <footer className="border-t dark:border-border mt-16">
      <div className="mx-auto max-w-6xl px-8 py-10 text-xs text-gray-500 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
