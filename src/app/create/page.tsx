'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAccount, useEnsName } from 'wagmi';
import WalletGuard from '@/components/WalletGuard';
import TagInput from '@/components/TagInput';
import toast from 'react-hot-toast';
import { PencilLine, SaveIcon, SendIcon, ShieldAlert } from 'lucide-react';
import Button from '@/components/ui/Button';
import AskArticleDrawer from '@/components/AskArticleDrawer';
import clsx from 'clsx';
import { Tooltip } from '@/components/ui/Tooltip';
import RewriteModal from '@/components/RewriteModal';

const Editor = dynamic(() => import('@/components/Editor.client'), { ssr: false });

export default function CreateForm() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({ title: '', summary: '' });
    const [riskLevel, setRiskLevel] = useState<'Safe' | 'Sensitive' | 'Offensive' | 'Unknown' | ''>('');
    const [analyzingRisk, setAnalyzingRisk] = useState(false);
    const [rewriteOpen, setRewriteOpen] = useState(false);
    const [rewriting, setRewriting] = useState(false);
    const [rewrittenContent, setRewrittenContent] = useState('');
    const [savingDraft, setSavingDraft] = useState(false);

    const searchParams = useSearchParams();
    const draftId = searchParams.get('id');
    const router = useRouter();

    const { address } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const authorName = ensName || (address ? `0x${address.slice(0, 6)}...${address.slice(-4)}` : 'anonymous');

    useEffect(() => {
        if (!draftId) {
            setTitle('');
            setSummary('');
            setTags([]);
            setContent('');
            setErrors({ title: '', summary: '' });
            setRiskLevel('');
            return;
        }

        const fetchDraft = async () => {
            try {
                const { data, error } = await supabase
                    .from('drafts')
                    .select('*')
                    .eq('id', draftId)
                    .single();

                if (error) {
                    console.error('Error fetching draft:', error.message);
                    return;
                }

                if (data) {
                    setTitle(data.title || '');
                    setSummary(data.summary || '');
                    setTags(data.tags || []);
                    setContent(data.content || '');
                    setRiskLevel(data.risk_level || '');
                }
            } catch (err) {
                console.error('Unexpected error fetching draft:', err);
            }
        };

        fetchDraft();
    }, [draftId]);

    const handleSaveDraft = async () => {
        if (!title.trim()) {
            setErrors({ title: 'Title is required.', summary: '' });
            return false;
        }

        setErrors({ title: '', summary: '' });

        const payload = {
            title: title.trim(),
            summary: summary.trim(),
            tags,
            content,
            author: authorName,
            is_published: false,
            status: 'draft',
            wallet_address: address || null,
        };

        try {
            if (draftId) {
                const { error } = await supabase.from('drafts').update(payload).eq('id', draftId);
                if (error) {
                    toast.error(`Failed to save draft: ${error.message}`);
                    return false;
                } else {
                    return true;
                }
            } else {
                const { data, error } = await supabase.from('drafts').insert([payload]).select().single();
                if (error) {
                    toast.error(`Failed to save draft: ${error.message}`);
                    return false;
                } else if (data?.id) {
                    router.push(`/create?id=${data.id}`);
                    return true;
                }
            }
        } catch (err) {
            console.error('Unexpected error saving draft:', err);
            toast.error('Unexpected error.');
            return false;
        }
    };

    const handleManualSaveDraft = async () => {
        setSavingDraft(true);
        const result = await handleSaveDraft();
        setSavingDraft(false);

        if (result) {
            toast.success('Draft saved successfully!');
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
            toast.error('Content cannot be empty.');
            return;
        }
        if (tags.length > 5) {
            toast.error('Please limit tags to a maximum of 5.');
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
            author: authorName,
            is_published: false,
            status: 'under_review',
            submitted_at: new Date().toISOString(),
            wallet_address: address || null,
        };

        if (!draftId) {
            const { error } = await supabase.from('drafts').insert([payload]);
            if (error) {
                toast.error(`Failed to submit for review: ${error.message}`);
            } else {
                toast.success('Article submitted for review!');
            }
        } else {
            const { error } = await supabase
                .from('drafts')
                .update({
                    status: 'under_review',
                    submitted_at: new Date().toISOString(),
                    wallet_address: address || null,
                    author: authorName,
                })
                .eq('id', draftId);

            if (error) {
                toast.error('Submission failed. Please try again.');
            } else {
                toast.success('Draft submitted for review!');
            }
        }
    };

    const analyzeRisk = async () => {
        if (!content.trim()) {
            toast.error('Please write some content before analyzing risk.');
            return;
        }

        setAnalyzingRisk(true);

        try {
            const response = await fetch('/api/risk-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ article: content }),
            });

            const data = await response.json();
            if (data.riskLevel) {
                setRiskLevel(data.riskLevel as any);
                toast.success(`Risk level: ${data.riskLevel}`);

                if (draftId) {
                    const { error } = await supabase
                        .from('drafts')
                        .update({ risk_level: data.riskLevel })
                        .eq('id', draftId);

                    if (error) {
                        console.error('Error saving risk level:', error.message);
                    }
                }
            } else {
                toast.error('Risk analysis failed.');
            }
        } catch (error) {
            console.error('Error analyzing risk:', error);
            toast.error('Error analyzing risk.');
        } finally {
            setAnalyzingRisk(false);
        }
    };

    const handleRegenerateRewrite = async () => {
        if (!content.trim()) {
            toast.error('Content is empty.');
            return false;
        }

        setRewriting(true);
        setRewrittenContent('');

        try {
            const response = await fetch('/api/ask-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    article: content,
                    question: "Please rewrite this article to make it completely Safe, avoiding any sensitive, offensive, or controversial language. Preserve the main ideas but make the tone very neutral and positive.",
                    mode: 'rewrite' // ✅ important!
                }),
            });

            const data = await response.json();
            if (data.answer) {
                setRewrittenContent(data.answer);
                return true;
            } else {
                toast.error('Rewrite failed.');
                return false;
            }
        } catch (error) {
            console.error('Error rewriting article:', error);
            toast.error('Rewrite error.');
            return false;
        } finally {
            setRewriting(false);
        }
    };

    return (
        <WalletGuard>
            {/* Secondary Top Header */}
            <div className="sticky top-0 z-30">
                <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 shadow-sm px-4"
                    style={{ minHeight: '60px' }}>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-800 dark:text-zinc-100 ml-4">
                        <PencilLine className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
                        Start Writing
                    </h2>
                    <div className="flex gap-3">
                        <AskArticleDrawer articleContent={content} />
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={analyzeRisk}
                            loading={analyzingRisk}
                            disabled={savingDraft || analyzingRisk}
                            leftIcon={<ShieldAlert className="h-4 w-4" />}
                        >
                            Analyze Risk
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            leftIcon={<SaveIcon className="h-4 w-4" />}
                            onClick={handleManualSaveDraft}
                            loading={savingDraft}
                        >
                            Save Draft
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<SendIcon className="h-4 w-4" />}
                            onClick={handleSubmitForReview}
                            disabled={savingDraft}
                        >
                            Submit for Review
                        </Button>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="relative pt-6 max-w-5xl w-full mx-auto text-black dark:text-white transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="Enter your article title here..."
                        className="flex-1 text-3xl font-semibold bg-transparent border-none border-b-2 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                        }}
                    />
                    {riskLevel && (
                        <div className="flex items-center gap-2">
                            <Tooltip content="Content risk level based on AI analysis.">
                                <div
                                    className={clsx(
                                        'inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-default',
                                        riskLevel === 'Safe' && 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200',
                                        riskLevel === 'Sensitive' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200',
                                        riskLevel === 'Offensive' && 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200',
                                        riskLevel === 'Unknown' && 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                    )}
                                >
                                    {riskLevel}
                                </div>
                            </Tooltip>
                            {riskLevel !== 'Safe' && (
                                <Button
                                    size="sm"
                                    variant="warning"
                                    onClick={() => setRewriteOpen(true)}
                                    disabled={savingDraft}
                                >
                                    Rewrite to Safe
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {errors.title && <p className="text-red-400 text-sm mb-4">{errors.title}</p>}

                <textarea
                    rows={2}
                    placeholder="Write a short summary for your article..."
                    className="w-full resize-none mb-6 bg-transparent text-base border-none border-b-2 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    value={summary}
                    onChange={(e) => {
                        setSummary(e.target.value);
                        if (errors.summary) setErrors((prev) => ({ ...prev, summary: '' }));
                    }}
                />
                {errors.summary && <p className="text-red-400 text-sm mb-4">{errors.summary}</p>}

                <TagInput tags={tags} setTags={setTags} />

                <div className="mt-6">
                    <Editor content={content} setContent={setContent} />
                </div>
            </div>

            {/* Rewrite Modal */}
            <RewriteModal
                isOpen={rewriteOpen}
                onClose={() => setRewriteOpen(false)}
                onAccept={async () => {
                    if (rewrittenContent) {
                        setContent(rewrittenContent);
                        setRewriteOpen(false);

                        setSavingDraft(true);
                        const result = await handleSaveDraft();
                        setSavingDraft(false);

                        if (result) {
                            toast.success('Content updated and draft saved!');
                        }
                    }
                }}
                onRegenerate={handleRegenerateRewrite}
                loading={rewriting}
                rewrittenContent={rewrittenContent}
                setRewrittenContent={setRewrittenContent}
            />
        </WalletGuard>
    );
}
