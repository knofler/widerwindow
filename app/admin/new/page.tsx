'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);
}

const MD_BUTTONS = [
  { label: 'H1', insert: '# ' },
  { label: 'H2', insert: '## ' },
  { label: 'Bold', wrap: '**' },
  { label: 'Italic', wrap: '_' },
  { label: 'Code', wrap: '`' },
  { label: 'Quote', insert: '> ' },
  { label: 'List', insert: '- ' }
];

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [authorName, setAuthorName] = useState('');
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

  function applyMd(btn: any) {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    let next = content;
    if (btn.wrap) {
      next = content.slice(0,start) + btn.wrap + selected + btn.wrap + content.slice(end);
    } else if (btn.insert) {
      // insert at line start
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      next = content.slice(0,lineStart) + btn.insert + content.slice(lineStart);
    }
    setContent(next);
    setTimeout(()=>{ if(textarea){ textarea.focus(); textarea.selectionStart = start + (btn.insert ? btn.insert.length : btn.wrap?.length || 0); textarea.selectionEnd = textarea.selectionStart; }},0);
  }

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
        excerpt: md.replace(/\n+/g,' ').slice(0,160),
        authorName: authorName || 'Admin'
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
    <div className="space-y-10">
      <div className="flex items-end flex-wrap gap-4 justify-between">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight">New Post</h1>
          {slug && <span className="text-xs text-gray-500">/{slug}</span>}
        </div>
        <div className="flex gap-2">
          <button disabled={saving} onClick={()=>save(false)} className="rounded-md border border-gray-300 dark:border-border px-4 py-2 text-sm bg-white dark:bg-surface hover:bg-gray-100 dark:hover:bg-surface/60 disabled:opacity-50">Save Draft</button>
          <button disabled={saving} onClick={()=>save(true)} className="rounded-md bg-brand text-white px-4 py-2 text-sm hover:bg-brand-dark disabled:opacity-50">Publish</button>
          {published && <a className="text-sm text-brand underline ml-2" href={`/posts/${slug}`}>View →</a>}
        </div>
      </div>

      <div className="grid gap-8 xl:gap-10 xl:grid-cols-[1fr_1fr] items-start">
        {/* Left Panel */}
        <div className="space-y-6">
          <div className="grid gap-5 bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-border p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1 text-gray-500">Title</label>
                <input className="w-full text-2xl font-semibold tracking-tight focus:outline-none bg-transparent rounded-md border border-gray-300 dark:border-border px-3 py-2" placeholder="Post title" value={title} onChange={(e: any)=>handleTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-500">Author</label>
                <input className="w-full rounded-md border border-gray-300 dark:border-border px-3 py-2 text-sm bg-transparent" placeholder="Your name" value={authorName} onChange={(e:any)=>setAuthorName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-500">Tags (comma)</label>
                <input className="w-full rounded-md border border-gray-300 dark:border-border px-3 py-2 text-sm bg-transparent" placeholder="tag1, tag2" value={tags} onChange={(e: any)=>setTags(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-500">Content</label>
              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 rounded-md border border-gray-300 dark:border-border bg-gray-50/70 dark:bg-surface/60 p-1">
                {MD_BUTTONS.map(btn => (
                  <button key={btn.label} type="button" onClick={()=>applyMd(btn)} className="text-[11px] font-medium px-2.5 py-1 rounded-md hover:bg-white dark:hover:bg-surface border border-transparent hover:border-gray-200 dark:hover:border-border transition">
                    {btn.label}
                  </button>
                ))}
              </div>
              <textarea
                id="editor"
                className="w-full min-h-[480px] resize-y rounded-xl border border-gray-300 dark:border-border bg-white dark:bg-surface px-4 py-3 font-mono text-[13px] leading-6 focus:outline-none focus:ring-2 focus:ring-brand/40 shadow-inner"
                placeholder="# Heading\nWrite your post in markdown..."
                value={content}
                onChange={(e: any)=>setContent(e.target.value)}
              />
              <p className="text-[11px] text-gray-500">Markdown supported. Use toolbar for quick inserts.</p>
            </div>
            <div className="text-xs flex gap-4">
              {error && <p className="text-red-600">{error}</p>}
              {message && <p className="text-green-600">{message}</p>}
            </div>
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-surface p-6 shadow-sm max-h-[calc(100vh-180px)] overflow-auto">
            <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
              {!title && !content && <p className="text-gray-400">Live preview will appear here as you type…</p>}
              {title && <h1 className="mt-0">{title}</h1>}
              {authorName && <p className="text-xs -mt-4 mb-4 text-gray-500">by {authorName}</p>}
              {tags && <p className="text-xs -mt-2 mb-6 text-gray-500">{tags.split(',').map(t=>t.trim()).filter(Boolean).join(', ')}</p>}
              {content && <ReactMarkdown>{content}</ReactMarkdown>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
