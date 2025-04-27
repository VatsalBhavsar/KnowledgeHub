'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface RewriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    onRegenerate: () => Promise<boolean>;
    loading: boolean;
    rewrittenContent: string;
    setRewrittenContent: (text: string) => void; // 🆕 add setter
}

export default function RewriteModal({
    isOpen,
    onClose,
    onAccept,
    onRegenerate,
    loading,
    rewrittenContent,
    setRewrittenContent, // 🆕
}: RewriteModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRewrittenContent(''); // 🆕 Reset content when opening
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [isOpen, setRewrittenContent]); // 🆕 Add setRewrittenContent in deps

    if (!visible) return null;

    return (
        <div className={cn(
            'fixed inset-0 z-50 flex items-center justify-center transition-all',
            isOpen ? 'bg-black/40 dark:bg-black/60' : 'bg-transparent pointer-events-none'
        )}>
            <div className={cn(
                'bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-2xl p-6 relative transition-transform transition-opacity duration-300',
                isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                        Rewrite to Safe
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-700 dark:text-zinc-300 hover:text-red-500 transition text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="mb-6">
                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">Rewriting... Please wait.</p>
                    ) : rewrittenContent ? (
                        <textarea
                            className="w-full h-64 resize-none p-4 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                            value={rewrittenContent}
                            readOnly
                        />
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            Click regenerate to generate rewritten content.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAccept}
                        disabled={!rewrittenContent || loading}
                    >
                        Accept Rewrite
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onRegenerate}
                        loading={loading}
                    >
                        {loading ? '' : 'Regenerate'}
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
