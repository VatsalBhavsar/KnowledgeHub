'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import Link from 'next/link';

export default function DraftsPage() {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrafts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .eq('is_published', false)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching drafts:', error.message);
            } else {
                setDrafts(data);
            }

            setLoading(false);
        };

        fetchDrafts();
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Your Drafts</h1>

            {loading ? (
                <p className="text-gray-400">Loading drafts...</p>
            ) : drafts.length === 0 ? (
                <p className="text-gray-400">No drafts found.</p>
            ) : (
                <ul className="space-y-4">
                    {drafts.map((draft) => (
                        <li key={draft.id} className="border rounded p-4 bg-zinc-900">
                            <h2 className="text-xl font-semibold">{draft.title || 'Untitled'}</h2>
                            <p className="text-sm text-gray-400 mb-2">{draft.summary}</p>
                            <p className="text-xs text-gray-500">Created: {new Date(draft.created_at).toLocaleString()}</p>
                            <div className="mt-4 flex gap-4 items-center">
                                {(!draft.status || draft.status === 'draft') && (
                                    <Link href={`/create?id=${draft.id}`}>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Continue Editing
                                        </button>
                                    </Link>
                                )}

                                {draft.status === 'under_review' && (
                                    <span className="text-yellow-400 text-sm">⏳ Submitted for Review</span>
                                )}

                                {draft.status === 'approved' && (
                                    <Link href={`/create?id=${draft.id}`}>
                                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                            Publish
                                        </button>
                                    </Link>
                                )}

                                {draft.status === 'rejected' && (
                                    <Link href={`/create?id=${draft.id}`}>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                            Edit & Resubmit
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
