'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react'
import { useTheme } from '@/components/ThemeProvider'

interface EditorProps {
    content: string
    setContent: Dispatch<SetStateAction<string>>
}

export default function Editor({ content, setContent }: EditorProps) {
    const [mounted, setMounted] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="text-zinc-800 dark:text-white">
            <label className="text-sm font-medium block mb-2">Main Content</label>
            <div className="rounded-md border border-zinc-300 dark:border-zinc-600 overflow-hidden shadow-sm transition-colors">
                <TinyMCEEditor
                    key={theme} // ✅ forces re-render when theme changes
                    value={content}
                    onEditorChange={(newValue: string) => setContent(newValue)}
                    init={{
                        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                        content_css: theme === 'dark' ? 'dark' : 'default',
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
                background-color: ${theme === 'dark' ? '#18181b' : '#ffffff'};
                color: ${theme === 'dark' ? '#f4f4f5' : '#18181b'};
                font-family: system-ui, sans-serif;
                font-size: 14px;
              }
              a { color: ${theme === 'dark' ? '#3b82f6' : '#2563eb'}; }
              table, th, td {
                border: 1px solid ${theme === 'dark' ? '#404040' : '#d1d5db'};
              }
            `,
                    }}
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                />
            </div>
        </div>
    )
}
