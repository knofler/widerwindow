'use client';
import { Editor } from '@tiptap/react';
import { useCallback } from 'react';

interface Props { editor: Editor | null }

const btnBase = 'inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-border px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface/60 transition disabled:opacity-40 disabled:cursor-not-allowed';

function ToolButton({ onClick, active, label, disabled }: { onClick: () => void; active?: boolean; label: string; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={btnBase + (active ? ' bg-brand text-white border-brand hover:bg-brand-dark' : '')}>{label}</button>
  );
}

export default function EditorToolbar({ editor }: Props) {
  const wrap = useCallback((fn: () => Editor) => { if (!editor) return; fn().chain().focus(); }, [editor]);
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-surface p-2 sticky top-0 z-10">
      <ToolButton label="H1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
      <ToolButton label="H2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
      <ToolButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolButton label="Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
      <ToolButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <ToolButton label="UL" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolButton label="OL" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <ToolButton label="HR" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      <ToolButton label="Clear" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} />
    </div>
  );
}
