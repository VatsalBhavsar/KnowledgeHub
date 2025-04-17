'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

interface EditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

export default function Editor({ content, setContent }: EditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="text-white">
      <label className="text-sm font-medium">Main Content</label>
      <div className="mt-2">
        <TinyMCEEditor
          value={content}
          onEditorChange={(newValue: string) => setContent(newValue)}
          init={{
            skin: 'oxide-dark',
            content_css: 'dark',
            height: 400,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
              'preview', 'anchor', 'searchreplace', 'visualblocks',
              'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar:
              'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code',
            branding: false,
            promotion: false,
          }}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
        />
      </div>
    </div>
  );
}
