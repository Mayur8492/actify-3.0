import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Heading2 } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-surface rounded-lg border border-border">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-primary bg-card' : 'text-textSecondary'}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('bold') ? 'text-primary bg-card' : 'text-textSecondary'}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('italic') ? 'text-primary bg-card' : 'text-textSecondary'}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-border self-center mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('bulletList') ? 'text-primary bg-card' : 'text-textSecondary'}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('orderedList') ? 'text-primary bg-card' : 'text-textSecondary'}`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-card transition-colors ${editor.isActive('blockquote') ? 'text-primary bg-card' : 'text-textSecondary'}`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Press "/" for commands, or just start typing...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px]',
      },
    },
  });

  // Sync external content changes (e.g. when changing pages)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col h-full w-full">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
