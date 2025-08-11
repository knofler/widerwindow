import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

async function getPosts() {
  await connectDB();
  return Post.find({ published: true }).sort({ createdAt: -1 }).lean();
}

export default async function PostsIndex() {
  const posts: any[] = await getPosts();
  return (
    <div className="space-y-14">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">All Posts</h1>
          <p className="text-sm text-gray-500 mt-3">Browse all published articles.</p>
        </div>
        <Link href="/admin/new" className="text-sm font-medium text-brand hover:underline">New Post</Link>
      </header>
      <ul className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 && <li className="text-gray-500">No posts yet.</li>}
        {posts.map((p) => {
          const date = p.publishedAt || p.updatedAt || p.createdAt;
          const dateStr = date ? new Date(date).toLocaleDateString(undefined,{ month:'short', day:'numeric', year:'numeric'}) : '';
          return (
            <li
              key={p._id}
              className="group relative rounded-2xl border border-gray-200 dark:border-transparent bg-white/90 dark:bg-surface/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition overflow-hidden hover:-translate-y-0.5 will-change-transform"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-brand/5 via-brand/0 to-brand-dark/10 pointer-events-none" />
              <Link href={`/posts/${p.slug}`} className="flex flex-col h-full">
                <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-wide font-medium text-gray-400 dark:text-gray-500">
                  {dateStr && <span>{dateStr}</span>}
                  {p.authorName && <><span>•</span><span className="text-gray-500 dark:text-gray-400">{p.authorName}</span></>}
                </div>
                <h3 className="font-serif font-semibold text-xl leading-snug tracking-tight group-hover:text-brand line-clamp-3 flex-1">
                  {p.title}
                </h3>
                {p.excerpt && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{p.excerpt}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(p.tags||[]).slice(0,4).map((t:string)=>(
                    <span key={t} className="px-2.5 py-0.5 rounded-full bg-gray-150 dark:bg-gray-750 text-[11px] tracking-wide text-gray-600 dark:text-gray-300">{t}</span>
                  ))}
                </div>
              </Link>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-brand/20 transition pointer-events-none" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
