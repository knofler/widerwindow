import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80) || 'post';
}
function randomSuffix(len=5){return Math.random().toString(36).slice(2,2+len);} 

export async function GET() {
  await connectDB();
  const posts = await Post.find({ published: true }).sort({ publishedAt: -1 }).limit(20).lean();
  return new Response(JSON.stringify(posts), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const data = await req.json();
    const title: string = data.title || '';
    let baseSlug: string = data.slug ? slugify(data.slug) : slugify(title || data.contentMarkdown || '');
    if (baseSlug.length < 3) baseSlug = baseSlug + '-' + randomSuffix();

    const docBase = {
      title: title || 'Untitled',
      excerpt: data.excerpt || (data.contentMarkdown ? data.contentMarkdown.slice(0,160) : ''),
      contentMarkdown: data.contentMarkdown || '',
      editorState: data.editorState || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      published: !!data.published,
      affiliateLinks: data.affiliateLinks || [],
      authorName: data.authorName || 'Admin'
    };

    async function createWithRetry(max=5) {
      let attempt = 0; let slug = baseSlug; let lastErr: any;
      while (attempt < max) {
        try {
          // ensure unique before create to avoid obvious duplicate
          if (attempt === 0) {
            let i=1; let candidate=slug;
            while (await Post.exists({ slug: candidate })) {
              candidate = `${baseSlug}-${i++}`;
            }
            slug = candidate;
          }
          const post = await Post.create({ ...docBase, slug });
          return post;
        } catch (e: any) {
          if (e?.code === 11000 && e?.keyPattern?.slug) {
            attempt++;
            slug = `${baseSlug}-${randomSuffix(4)}${attempt}`; // new slug variant
            continue;
          }
          lastErr = e; break;
        }
      }
      if (lastErr) throw lastErr;
      throw new Error('failed_to_create');
    }

    const post = await createWithRetry();
    return new Response(JSON.stringify(post), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'create_failed', message: e.message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
