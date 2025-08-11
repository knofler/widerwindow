import React from 'react';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

interface Props { params: { slug: string } }

export default async function PostPage({ params }: Props) {
  await connectDB();
  const post = await Post.findOne({ slug: params.slug, published: true }).lean();
  if (!post) {
    return <div className="py-20 text-center text-gray-500">Post not found.</div>;
  }
  return (
    <article className="prose-custom">
      <h1>{post.title}</h1>
      {post.tags?.length > 0 && (
        <p className="text-sm -mt-4 mb-6 text-gray-500">{post.tags.join(', ')}</p>
      )}
      <ReactMarkdown>{post.contentMarkdown || ''}</ReactMarkdown>
    </article>
  );
}
