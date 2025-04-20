'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { useSearchParams } from 'next/navigation';
import TagInput from '@/components/TagInput';
import { useAccount } from 'wagmi';

const Editor = dynamic(() => import('@/components/Editor.client'), {
  ssr: false,
});

export default function CreateArticlePage() {
  const { address, isConnected } = useAccount();
  const [hasMounted, setHasMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({ title: '', summary: '' });
  const searchParams = useSearchParams();
  const draftId = searchParams.get('id');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchDraft = async () => {
      if (!draftId) return;

      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('id', draftId)
        .single();

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
    if (!title.trim()) {
      alert('Title is required to save a draft.');
      return;
    }

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      tags,
      content,
      author: isConnected ? address : 'anonymous',
      is_published: false,
      status: 'draft',
    };

    const { error } = draftId
      ? await supabase.from('drafts').update(payload).eq('id', draftId)
      : await supabase.from('drafts').insert([payload]);

    if (error) {
      alert(`Failed to save draft: ${error.message}`);
    } else {
      alert('Draft saved!');
    }
  };

  const isContentEmpty = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.innerText.trim() === '';
  };

  const handleSubmitForReview = async () => {
    const newErrors = { title: '', summary: '' };

    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!summary.trim()) newErrors.summary = 'Summary is required.';
    if (isContentEmpty(content)) {
      alert('Content cannot be empty.');
      return;
    }
    if (tags.length > 5) {
      alert('Please limit tags to a maximum of 5.');
      return;
    }
    if (newErrors.title || newErrors.summary) {
      setErrors(newErrors);
      return;
    }

    setErrors({ title: '', summary: '' });

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      tags: tags.map((tag) => tag.trim().toLowerCase()),
      content,
      author: 'anonymous',
      is_published: false,
      status: 'under_review',
      submitted_at: new Date().toISOString(),
    };

    if (!draftId) {
      const { error } = await supabase.from('drafts').insert([payload]);
      if (error) {
        alert(`Failed to submit for review: ${error.message}`);
      } else {
        alert('Article submitted for review!');
      }
    } else {
      const { error } = await supabase
        .from('drafts')
        .update({
          status: 'under_review',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', draftId);

      if (error) {
        alert('Submission failed. Please try again.');
      } else {
        alert('Draft submitted for review!');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Article</h1>

      <div className="space-y-4">
        {/* TITLE FIELD */}
        <div>
          <input
            type="text"
            className={`w-full border px-4 py-2 rounded-md focus:outline-none transition ${
              errors.title
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-zinc-700 focus:ring-1 focus:ring-blue-500'
            }`}
            placeholder="Article Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title && e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, title: '' }));
              }
            }}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* SUMMARY FIELD */}
        <div>
          <textarea
            className={`w-full border px-4 py-2 rounded-md focus:outline-none transition ${
              errors.summary
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-zinc-700 focus:ring-1 focus:ring-blue-500'
            }`}
            placeholder="Short Summary"
            value={summary}
            rows={3}
            onChange={(e) => {
              setSummary(e.target.value);
              if (errors.summary && e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, summary: '' }));
              }
            }}
          />
          {errors.summary && (
            <p className="text-red-400 text-sm mt-1">{errors.summary}</p>
          )}
        </div>

        <TagInput tags={tags} setTags={setTags} />

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
