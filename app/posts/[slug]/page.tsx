import React from 'react';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

interface Props { params: { slug: string } }

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// basic slugify for heading anchors
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default async function PostPage({ params }: Props) {
  await connectDB();
  const post: any = await Post.findOne({ slug: params.slug, published: true }).lean();
  if (!post) {
    return <div className="py-32 text-center text-gray-500">Post not found.</div>;
  }
  const md = post.contentMarkdown || '';
  const minutes = readingTime(md);
  const date = post.publishedAt || post.updatedAt || post.createdAt;
  const dateStr = date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="reading-progress" />
      <header className="mb-14 animate-fadeIn">
        <h1 className="font-serif font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance bg-gradient-to-r from-brand via-brand-light to-brand-dark bg-clip-text text-transparent">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          {dateStr && <time dateTime={new Date(date).toISOString()}>{dateStr}</time>}
          <span>·</span>
          <span>{post.authorName || 'Admin'}</span>
          <span>·</span>
          <span>{minutes} min read</span>
          {post.tags?.length > 0 && (
            <span className="flex flex-wrap gap-2">{post.tags.map((t: string) => (
              <span key={t} className="px-2.5 py-0.5 rounded-full bg-gray-150 dark:bg-gray-750 text-[11px] font-medium tracking-wide text-gray-600 dark:text-gray-300">{t}</span>
            ))}</span>
          )}
        </div>
      </header>
      <article className="prose prose-lg dark:prose-invert max-w-none animate-fadeIn">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 id={slugify(String(props.children))} {...props} />,
            h2: ({ node, ...props }) => <h2 id={slugify(String(props.children))} {...props} />,
            h3: ({ node, ...props }) => <h3 id={slugify(String(props.children))} {...props} />,
            h4: ({ node, ...props }) => <h4 id={slugify(String(props.children))} {...props} />,
            code: ({ inline, children, ...props }) => inline ? (
              <code {...props}>{children}</code>
            ) : (
              <pre className="overflow-x-auto"><code {...props}>{children}</code></pre>
            )
          }}
        >{md}</ReactMarkdown>
      </article>
    </div>
  );
}
