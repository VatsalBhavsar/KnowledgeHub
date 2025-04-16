'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { useSearchParams } from 'next/navigation';

const Editor = dynamic(() => import('@/components/Editor.client'), { ssr: false });

export default function CreateArticlePage() {
    const [hasMounted, setHasMounted] = useState(false);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const searchParams = useSearchParams();
    const draftId = searchParams.get('id');

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const fetchDraft = async () => {
            if (!draftId) return;

            const { data, error } = await supabase.from('drafts').select('*').eq('id', draftId).single();
            if (error) {
                console.error('Error fetching draft:', error.message);
            } else {
                setTitle(data.title);
                setSummary(data.summary);
                setTags(data.tags || []);
                setContent(data.content);
            }
        };

        fetchDraft();
    }, [draftId]);

    if (!hasMounted) return null;

    const handleSaveDraft = async () => {
        const payload = { title, summary, tags, content, author: 'anonymous' };

        const { data, error } = draftId
            ? await supabase.from('drafts').update(payload).eq('id', draftId)
            : await supabase.from('drafts').insert([payload]);

        if (error) {
            alert(`Failed to save draft: ${error.message}`);
        } else {
            alert('Draft saved!');
        }
    };


    const handleSubmitForReview = async () => {
        if (!draftId) {
            alert('Please save the draft before submitting it for review.');
            return;
        }

        const { error } = await supabase
            .from('drafts')
            .update({
                status: 'under_review',
                submitted_at: new Date().toISOString(),
            })
            .eq('id', draftId);

        if (error) {
            console.error('Failed to submit for review:', error.message);
            alert('Submission failed. Please try again.');
        } else {
            alert('Draft submitted for review!');
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Create Article</h1>

            <div className="space-y-4">
                <input
                    type="text"
                    className="w-full border px-4 py-2 rounded-md"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="w-full border px-4 py-2 rounded-md"
                    placeholder="Short Summary (optional)"
                    value={summary}
                    rows={3}
                    onChange={(e) => setSummary(e.target.value)}
                />

                <div>
                    <label className="text-sm font-medium">Tags (coming soon)</label>
                    <div className="mt-1 text-gray-500 text-sm italic">Tag input UI will be added later</div>
                </div>

                <Editor content={content} setContent={setContent} />

                <div className="flex gap-4 mt-6">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </button>
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        onClick={handleSubmitForReview}
                    >
                        Submit for Review
                    </button>
                </div>
            </div>
        </div>
    );
}
