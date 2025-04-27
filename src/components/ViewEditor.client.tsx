'use client';

import { useEffect, useState } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';

interface ViewEditorProps {
    content: string;
}

export default function ViewEditor({ content }: ViewEditorProps) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !resolvedTheme) return null;

    const backgroundColor = resolvedTheme === 'dark' ? '#18181b' : '#ffffff';
    const textColor = resolvedTheme === 'dark' ? '#f4f4f5' : '#18181b';
    const linkColor = resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb';
    const borderColor = resolvedTheme === 'dark' ? '#404040' : '#d1d5db';

    return (
        <div className="transition-colors">
            <TinyMCEEditor
                key={resolvedTheme}
                value={content}
                init={{
                    licenseKey: 'gpl',
                    skin: resolvedTheme === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: resolvedTheme === 'dark' ? 'dark' : 'default',
                    menubar: false,
                    toolbar: false,
                    branding: false,
                    promotion: false,
                    statusbar: false,
                    plugins: ['autoresize'],
                    disabled: true,
                    forced_root_block: '',
                    height: 'auto',
                    min_height: 0,
                    autoresize_bottom_margin: 0,
                    autoresize_overflow_padding: 0,
                    resize: false,
                    content_style: `
                        html, body {
                            background-color: ${backgroundColor} !important;
                            color: ${textColor} !important;
                            font-family: system-ui, sans-serif;
                            font-size: 1rem;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        a { color: ${linkColor} !important; }
                        table, th, td {
                            border: 1px solid ${borderColor} !important;
                        }
                    `,
                    setup: (editor) => {
                        editor.on('init', () => {
                            const iframe = editor.iframeElement;
                            const container = editor.getContainer();
                            const body = editor.getBody();

                            if (iframe) {
                                iframe.style.border = 'none';
                                iframe.style.margin = '0';
                                iframe.style.padding = '0';
                                iframe.style.outline = 'none';
                                iframe.style.backgroundColor = backgroundColor;
                                iframe.style.display = 'block';
                            }
                            if (container) {
                                container.style.border = 'none';
                                container.style.boxShadow = 'none';
                                container.style.backgroundColor = backgroundColor;
                            }
                            if (body) {
                                body.style.backgroundColor = backgroundColor;
                                body.style.color = textColor;
                                body.style.fontFamily = 'system-ui, sans-serif';
                                body.style.fontSize = '1rem';
                                body.style.padding = '0';
                                body.style.margin = '0';
                            }
                        });
                    },
                }}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                disabled
            />
        </div>
    );
}
