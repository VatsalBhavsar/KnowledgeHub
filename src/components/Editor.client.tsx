'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react'

interface EditorProps {
  content: string
  setContent: Dispatch<SetStateAction<string>>
}

export default function Editor({ content, setContent }: EditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="text-white">
      <label className="text-sm font-medium block mb-2">Main Content</label>
      <div className="rounded-md border border-zinc-700 dark:border-zinc-600 overflow-hidden shadow-sm">
        <TinyMCEEditor
          value={content}
          onEditorChange={(newValue: string) => setContent(newValue)}
          init={{
            skin: 'oxide-dark',
            content_css: 'dark',
            height: 400,
            menubar: false,
            branding: false,
            promotion: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code fullscreen',
            content_style: `
              body {
                background-color: #18181b;
                color: #f4f4f5;
                font-family: system-ui, sans-serif;
                font-size: 14px;
              }
              a { color: #3b82f6; }
              table, th, td {
                border: 1px solid #404040;
              }
            `,
          }}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
        />
      </div>
    </div>
  )
}
