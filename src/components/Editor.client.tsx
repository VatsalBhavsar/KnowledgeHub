'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes'; // ✅ Correct import

interface EditorProps {
    content: string;
    setContent: Dispatch<SetStateAction<string>>;
}

export default function Editor({ content, setContent }: EditorProps) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !resolvedTheme) return null;

    return (
        <div className="text-zinc-800 dark:text-white">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Main Content
            </label>

            <div className="transition-colors">
                <TinyMCEEditor
                    key={resolvedTheme} // ✅ Re-render when theme changes
                    value={content}
                    onEditorChange={(newValue: string) => setContent(newValue)}
                    init={{
                        skin: resolvedTheme === 'dark' ? 'oxide-dark' : 'oxide',
                        content_css: resolvedTheme === 'dark' ? 'dark' : 'default',
                        height: 400,
                        menubar: false,
                        branding: false,
                        promotion: false,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                            'preview', 'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                        ],
                        toolbar:
                            'undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist | outdent indent | link image table | code fullscreen',
                        content_style: `
                          body {
                            background-color: ${resolvedTheme === 'dark' ? '#18181b' : '#ffffff'};
                            color: ${resolvedTheme === 'dark' ? '#f4f4f5' : '#18181b'};
                            font-family: system-ui, sans-serif;
                            font-size: 14px;
                            padding: 0.5rem;
                          }
                          a { color: ${resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb'}; }
                          table, th, td {
                            border: 1px solid ${resolvedTheme === 'dark' ? '#404040' : '#d1d5db'};
                          }
                        `,
                    }}
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                />
            </div>
        </div>
    );
}
