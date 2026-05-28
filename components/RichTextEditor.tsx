"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Écrivez votre post ici...',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-slate-800 dark:text-slate-200',
      },
    },
  });

  // Update content when prop changes externally (e.g. new generation)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl overflow-hidden focus-within:border-[var(--color-accent)]/50 transition-colors">
      {editable && (
        <div className="flex flex-wrap gap-2 p-2 border-b border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-black/20">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-white/10 text-[var(--color-accent)]' : ''}`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-xs italic ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-white/10 text-[var(--color-accent)]' : ''}`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-xs line-through ${editor.isActive('strike') ? 'bg-slate-200 dark:bg-white/10 text-[var(--color-accent)]' : ''}`}
          >
            S
          </button>
          <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/10 mx-1 self-center" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-xs ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-white/10 text-[var(--color-accent)]' : ''}`}
          >
            • Liste
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-xs ${editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-white/10 text-[var(--color-accent)]' : ''}`}
          >
            1. Liste
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
