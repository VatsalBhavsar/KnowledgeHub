'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { uploadArticleToIPFS } from '@/lib/web3Uploader';
import UploadProgressModal from '@/components/UploadProgressModal';
import Link from 'next/link';
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    usePublicClient,
} from 'wagmi';
import { articleManagerABI } from '@/lib/contracts/articleManagerABI';
import { articleManagerAddress } from '@/lib/contracts/articleManagerAddress';
import toast from 'react-hot-toast';
import WalletGuard from '@/components/WalletGuard';
import { ClipboardList, Loader2, Check, X, UploadCloud } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { publishArticle } from '@/lib/publishArticle';

export default function ReviewsPage() {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const [ipfsCid, setIpfsCid] = useState('');
    const [idToUpdate, setIdToUpdate] = useState('');
    const [articleIndex, setArticleIndex] = useState<number | null>(null);

    const { address = '', isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const publicClient = usePublicClient();

    const { isLoading: isWaiting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
        query: { enabled: !!txHash },
    });

    useEffect(() => {
        const updateSupabase = async () => {
            if (isConfirmed && ipfsCid && idToUpdate && articleIndex !== null) {
                setUploadMessage('Saving metadata...');
                const { error } = await supabase
                    .from('drafts')
                    .update({
                        is_published: true,
                        published_at: new Date().toISOString(),
                        status: 'published',
                        ipfs_cid: ipfsCid,
                        article_index: articleIndex,
                    })
                    .eq('id', idToUpdate);

                if (error) {
                    setUploadStatus('error');
                    setUploadMessage(`Failed to publish: ${error.message}`);
                } else {
                    setUploadStatus('success');
                    setUploadProgress(100);
                    setUploadMessage('Article published to IPFS and blockchain!');
                    fetchDrafts();
                }
            }
        };

        updateSupabase();
    }, [isConfirmed]);

    const fetchDrafts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('drafts')
            .select('*')
            .in('status', ['under_review', 'approved'])
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('Error fetching drafts:', error.message);
        } else {
            setDrafts(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    const handleReviewAction = async (id: string, action: 'approved' | 'rejected') => {
        // Fetch latest status
        const { data: latestDraft, error } = await supabase
            .from('drafts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            toast.error('Failed to fetch latest draft status.');
            return;
        }

        if (!latestDraft) {
            toast.error('Draft not found.');
            return;
        }

        if (latestDraft.status === 'approved' || latestDraft.status === 'rejected') {
            toast.error(`This draft is already ${latestDraft.status}.`);
            fetchDrafts();
            return;
        }

        const alreadyReviewedBy = (latestDraft.reviewed_by || []) as string[];
        if (alreadyReviewedBy.includes(address)) {
            toast.error('You have already reviewed this draft.');
            fetchDrafts();
            return;
        }

        const { error: updateError } = await supabase
            .from('drafts')
            .update({
                status: action,
                reviewed_by: [...alreadyReviewedBy, address],
            })
            .eq('id', id);

        if (updateError) {
            toast.error(`Failed to update status: ${updateError.message}`);
        } else {
            toast.success(`Draft ${action}!`);
            fetchDrafts();
        }
    };

    const handlePublish = (id: string, title: string, content: string) => {
        publishArticle({
            id,
            title,
            content,
            setShowModal,
            setUploadStatus,
            setUploadMessage,
            setUploadProgress,
            setTxHash,
            setIpfsCid,
            setIdToUpdate,
            setArticleIndex,
            isConnected,
            publicClient,
            writeContractAsync,
        });
    };

    return (
        <WalletGuard>
            {/* Secondary Top Header */}
            <div className="sticky top-0 z-30">
                <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 shadow-sm px-4" style={{ minHeight: '60px' }}>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-800 dark:text-zinc-100 ml-4">
                        <ClipboardList className="h-7 w-7 text-zinc-800 dark:text-zinc-200" />
                        Review Submissions
                    </h2>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10 text-black dark:text-white transition-colors duration-300">
                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                        <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                        Loading submissions...
                    </p>
                ) : drafts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                        No drafts under review.
                    </p>
                ) : (
                    <ul className="grid gap-6">
                        {drafts.map((draft) => {
                            const reviewedBy = (draft.reviewed_by || []) as string[];
                            const youReviewed = reviewedBy.includes(address);

                            return (
                                <li key={draft.id} className="rounded-lg bg-gray-100 dark:bg-zinc-800 shadow-md hover:shadow-lg transition-all p-5">
                                    <h2 className="text-xl font-semibold mb-1">{draft.title || 'Untitled Draft'}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{draft.summary}</p>

                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                                        <span>Submitted: {new Date(draft.submitted_at || draft.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {draft.wallet_address !== address && (
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {draft.status === 'under_review' && !youReviewed ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        leftIcon={<Check className="h-4 w-4" />}
                                                        onClick={() => handleReviewAction(draft.id, 'approved')}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="error"
                                                        leftIcon={<X className="h-4 w-4" />}
                                                        onClick={() => handleReviewAction(draft.id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : (
                                                <span
                                                    className={cn(
                                                        'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                                                        youReviewed
                                                            ? draft.status === 'approved'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                                                                : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                                                            : draft.status === 'approved'
                                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
                                                    )}
                                                >
                                                    {youReviewed ? (
                                                        draft.status === 'approved' ? 'You already approved' : 'You already rejected'
                                                    ) : (
                                                        draft.status === 'approved' ? 'This is already approved' : 'This is already rejected'
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {draft.status === 'approved' && !draft.is_published && draft.wallet_address === address && (
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <Button
                                                size="sm"
                                                variant="success"
                                                leftIcon={<UploadCloud className="h-4 w-4" />}
                                                onClick={() => handlePublish(draft.id, draft.title, draft.content)}
                                            >
                                                Publish
                                            </Button>
                                        </div>
                                    )}

                                    {draft.status === 'published' && draft.is_published && (
                                        <Link
                                            href={`/article/${draft.id}`}
                                            className="text-blue-500 underline text-sm mt-2 block"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Public Article
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Upload Progress Modal */}
            <UploadProgressModal
                isOpen={showModal}
                status={uploadStatus}
                message={uploadMessage}
                progress={uploadProgress}
                onClose={() => {
                    setShowModal(false);
                    setUploadStatus('idle');
                    setUploadMessage('');
                    setUploadProgress(0);
                }}
            />
        </WalletGuard>
    );
}
