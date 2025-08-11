import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

export async function GET(_req: Request, context: any) {
  await connectDB();
  const { slug } = context.params;
  const post = await Post.findOne({ slug, published: true }).lean();
  if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  return new Response(JSON.stringify(post), { headers: { 'Content-Type': 'application/json' } });
}
