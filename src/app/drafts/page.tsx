'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import Link from 'next/link';

export default function DraftsPage() {
    const [drafts, setDrafts] = useState<any[]>([]);

    useEffect(() => {
        const fetchDrafts = async () => {
            const { data, error } = await supabase.from('drafts').select('*').order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching drafts:', error.message);
            } else {
                setDrafts(data);
            }
        };

        fetchDrafts();
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Your Drafts</h1>
            {drafts.length === 0 ? (
                <p className="text-gray-400">No drafts found.</p>
            ) : (
                <ul className="space-y-4">
                    {drafts.map((draft) => (
                        <li key={draft.id} className="border rounded p-4 bg-zinc-900">
                            <h2 className="text-xl font-semibold">{draft.title || 'Untitled'}</h2>
                            <p className="text-sm text-gray-400">{draft.summary}</p>
                            <p className="text-xs mt-2 text-gray-500">Created: {new Date(draft.created_at).toLocaleString()}</p>
                            <Link href={`/create?id=${draft.id}`}>
                                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Continue Editing
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
