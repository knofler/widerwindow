import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

async function getPosts() {
  await connectDB();
  return Post.find({ published: true }).sort({ createdAt: -1 }).lean();
}

export default async function PostsIndex() {
  const posts = await getPosts();
  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Posts</h1>
          <p className="text-sm text-gray-500 mt-2">Browse all published articles.</p>
        </div>
        <Link href="/admin/new" className="text-sm font-medium text-brand hover:underline">New Post</Link>
      </header>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 && <li className="text-gray-500">No posts yet.</li>}
        {posts.map((p: any) => (
          <li key={p._id} className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-border dark:bg-surface">
            <Link href={`/posts/${p.slug}`} className="block space-y-2">
              <h3 className="font-semibold text-lg tracking-tight group-hover:text-brand line-clamp-2">{p.title}</h3>
              {p.excerpt && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{p.excerpt}</p>}
              <p className="text-xs text-gray-400 dark:text-gray-500">{p.tags?.join(', ')}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
