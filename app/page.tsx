import Link from 'next/link';

async function getPosts() {
  try {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function extractTags(posts: any[]) {
  const set = new Set<string>();
  posts.forEach(p => (p.tags||[]).forEach((t:string)=> set.add(t)));
  return Array.from(set).sort();
}

export default async function HomePage() {
  const posts = await getPosts();
  const featured = posts[0];
  const rest = posts.slice(1);
  const tags = extractTags(posts);
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-850/70 backdrop-blur p-12 md:p-16 shadow-card animate-fadeIn">
        <div className="absolute inset-0 pointer-events-none bg-gradient-radial-soft" />
        <div className="relative grid gap-14 md:grid-cols-2 items-start">
          <div className="space-y-8">
            <h1 className="font-serif text-fluid-hero tracking-tight bg-gradient-to-r from-brand via-brand-light to-brand-dark bg-clip-text text-transparent">
              WiderWindow
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-prose leading-relaxed">Deeply curated tutorials, opinions, and implementation notes on modern web engineering.</p>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0,8).map(t => (
                <span key={t} className="px-3 py-1 rounded-full text-[11px] font-medium bg-gray-150 dark:bg-gray-750 text-gray-600 dark:text-gray-300">{t}</span>
              ))}
              {tags.length === 0 && <span className="text-xs text-gray-400">Add tags by publishing posts.</span>}
            </div>
            <div className="flex gap-4 pt-2">
              <Link href="/posts" className="rounded-md bg-brand text-white px-6 py-3 text-sm font-medium shadow hover:shadow-md hover:bg-brand-dark transition">Browse All</Link>
              <Link href="/admin/new" className="rounded-md border border-gray-300 dark:border-gray-650 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-750 transition">Write Post</Link>
            </div>
          </div>
          <div className="relative">
            {featured ? (
              <Link href={`/posts/${featured.slug}`} className="group block rounded-2xl h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 p-8 shadow-card hover:shadow-card-hover transition">
                <div className="flex flex-col h-full">
                  <div className="mb-5 text-xs font-semibold uppercase tracking-wide text-brand">Featured</div>
                  <h2 className="font-serif text-3xl font-semibold leading-snug tracking-tight group-hover:text-brand line-clamp-3 flex-1">{featured.title}</h2>
                  {featured.excerpt && <p className="mt-4 text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4">{featured.excerpt}</p>}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(featured.tags||[]).slice(0,4).map((t:string)=>(<span key={t} className="px-2.5 py-0.5 rounded-full bg-gray-150 dark:bg-gray-750 text-[11px] tracking-wide text-gray-600 dark:text-gray-300">{t}</span>))}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="h-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm text-gray-400">No posts yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Search & filter (static placeholder) */}
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 w-full md:max-w-md">
          <input placeholder="Search (coming soon)" disabled className="flex-1 rounded-lg border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-800/70 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-60" />
          <button disabled className="rounded-lg border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-800/70 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400">Go</button>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {tags.slice(0,10).map(t=> <span key={t} className="px-2.5 py-1 rounded-full bg-gray-150 dark:bg-gray-750 text-gray-600 dark:text-gray-300">{t}</span>)}
        </div>
      </section>

      {/* Posts grid */}
      <section className="space-y-8">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">Latest Articles</h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.length === 0 && !featured && <li className="text-gray-600">No posts yet.</li>}
          {(featured ? rest : posts).map((p: any) => (
            <li key={p._id} className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 p-7 shadow-card hover:shadow-card-hover transition overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-brand/5 to-brand-dark/10 pointer-events-none" />
              <Link href={`/posts/${p.slug}`} className="flex flex-col h-full">
                <h3 className="font-serif font-semibold text-xl tracking-tight group-hover:text-brand line-clamp-2 flex-1">{p.title}</h3>
                {p.excerpt && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{p.excerpt}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(p.tags||[]).slice(0,3).map((t:string)=>(<span key={t} className="px-2.5 py-0.5 rounded-full bg-gray-150 dark:bg-gray-750 text-[11px] tracking-wide text-gray-600 dark:text-gray-300">{t}</span>))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
