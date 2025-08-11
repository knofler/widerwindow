'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);
}

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const [message, setMessage] = useState<string|undefined>();

  const handleTitle = (v: string) => {
    setTitle(v);
    if (!slug) setSlug(slugify(v));
  };

  const save = async (publish: boolean) => {
    setSaving(true); setError(undefined); setMessage(undefined);
    try {
      const md = content;
      const body = {
        title,
        slug: slug || slugify(title),
        tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
        published: publish,
        editorState: null,
        contentMarkdown: md,
        excerpt: md.replace(/\n+/g,' ').slice(0,160)
      };
      const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Save failed');
      setMessage(publish ? 'Published' : 'Saved draft');
      if (publish) setPublished(true);
    } catch(e:any) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Create Post</h2>
        {slug && <span className="text-xs text-gray-500">/{slug}</span>}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Editor form */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">Title</label>
            <input className="w-full text-2xl font-semibold tracking-tight focus:outline-none bg-white dark:bg-surface rounded-md border px-3 py-2" placeholder="Post title" value={title} onChange={(e: any)=>handleTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">Tags (comma separated)</label>
            <input className="w-full border rounded px-3 py-2" placeholder="tag1, tag2" value={tags} onChange={(e: any)=>setTags(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 text-gray-500">Content (Markdown)</label>
            <textarea
              className="w-full min-h-[420px] resize-y rounded-lg border border-gray-300 dark:border-border bg-white dark:bg-surface px-4 py-3 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="# Heading\nWrite your post in markdown..."
              value={content}
              onChange={(e: any)=>setContent(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button disabled={saving} onClick={()=>save(false)} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100 dark:border-border dark:hover:bg-surface/60 disabled:opacity-50">Save Draft</button>
            <button disabled={saving} onClick={()=>save(true)} className="rounded-md bg-brand text-white px-4 py-2 text-sm hover:bg-brand-dark disabled:opacity-50">Publish</button>
            {published && <a className="text-sm text-brand underline ml-auto" href={`/posts/${slug}`}>View →</a>}
          </div>
          <div className="text-xs flex gap-4">
            {error && <p className="text-red-600">{error}</p>}
            {message && <p className="text-green-600">{message}</p>}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-surface p-6 overflow-auto max-h-[calc(100vh-220px)]">
          <div className="prose-custom">
            {!title && !content && <p className="text-gray-400">Live preview will appear here as you type…</p>}
            {title && <h1>{title}</h1>}
            {tags && <p className="text-xs -mt-4 mb-6 text-gray-500">{tags.split(',').map(t=>t.trim()).filter(Boolean).join(', ')}</p>}
            {content && <ReactMarkdown>{content}</ReactMarkdown>}
          </div>
        </div>
      </div>
    </div>
  );
}
