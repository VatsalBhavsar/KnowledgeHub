'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface EditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

export const Editor = ({ content, setContent }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          'min-h-[250px] max-w-none px-4 py-3 rounded-md focus:outline-none bg-zinc-900 text-zinc-100 border border-zinc-700 placeholder:text-zinc-400 prose prose-invert',
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div>
      <label className="text-sm font-medium text-white">Main Content</label>
      <div className="mt-1">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
