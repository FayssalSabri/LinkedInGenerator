'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  editable = true,
}: RichTextEditorProps) {
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
        class:
          'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-slate-800 dark:text-slate-200',
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
    <div className="focus-within:border-[var(--color-accent)]/50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors dark:border-white/[0.05] dark:bg-white/[0.02]">
      {editable && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-2 dark:border-white/[0.05] dark:bg-black/20">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`rounded p-1.5 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 ${editor.isActive('bold') ? 'bg-slate-200 text-[var(--color-accent)] dark:bg-white/10' : ''}`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`rounded p-1.5 text-xs italic hover:bg-slate-200 dark:hover:bg-white/10 ${editor.isActive('italic') ? 'bg-slate-200 text-[var(--color-accent)] dark:bg-white/10' : ''}`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`rounded p-1.5 text-xs line-through hover:bg-slate-200 dark:hover:bg-white/10 ${editor.isActive('strike') ? 'bg-slate-200 text-[var(--color-accent)] dark:bg-white/10' : ''}`}
          >
            S
          </button>
          <div className="mx-1 h-6 w-[1px] self-center bg-slate-300 dark:bg-white/10" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded p-1.5 text-xs hover:bg-slate-200 dark:hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-slate-200 text-[var(--color-accent)] dark:bg-white/10' : ''}`}
          >
            • Liste
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded p-1.5 text-xs hover:bg-slate-200 dark:hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-slate-200 text-[var(--color-accent)] dark:bg-white/10' : ''}`}
          >
            1. Liste
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
