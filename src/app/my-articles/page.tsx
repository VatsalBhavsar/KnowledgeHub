'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import Link from 'next/link';
import WalletGuard from '@/components/WalletGuard';
import Button from '@/components/ui/Button';
import { FileText, Loader2, CalendarDays, Edit, UploadCloud, RefreshCcw, SendHorizonal, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import UploadProgressModal from '@/components/UploadProgressModal';
import { publishArticle } from '@/lib/publishArticle'; // ✅ Correct reusable function

export default function MyArticlesPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Drafts' | 'Published'>('All');

    // Modal upload states
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const [ipfsCid, setIpfsCid] = useState('');
    const [idToUpdate, setIdToUpdate] = useState('');
    const [articleIndex, setArticleIndex] = useState<number | null>(null);

    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const { isLoading: isWaiting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
        query: { enabled: !!txHash },
    });

    useEffect(() => {
        fetchArticles();
    }, [address]);

    const fetchArticles = async () => {
        if (!address) return;

        setLoading(true);

        const { data, error } = await supabase
            .from('drafts')
            .select('*')
            .eq('wallet_address', address)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error.message);
        } else {
            setArticles(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (filter === 'All') {
            setFilteredArticles(articles);
        } else if (filter === 'Drafts') {
            setFilteredArticles(articles.filter((a) => !a.is_published));
        } else if (filter === 'Published') {
            setFilteredArticles(articles.filter((a) => a.is_published));
        }
    }, [articles, filter]);

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
                    fetchArticles();
                }
            }
        };

        updateSupabase();
    }, [isConfirmed]);

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
            isConnected: isConnected ?? false,
            publicClient,
            writeContractAsync,
        });
    };

    return (
        <WalletGuard>
            {/* Secondary Top Header */}
            <div className="sticky top-0 z-30">
                <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 shadow-sm px-4"
                    style={{ minHeight: '60px' }}>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-800 dark:text-zinc-100 ml-4">
                        <FileText className="h-6 w-6" />
                        My Articles
                    </h2>

                    <FilterDropdown
                        options={['All', 'Drafts', 'Published']}
                        value={filter}
                        onChange={(value) => setFilter(value as 'All' | 'Drafts' | 'Published')}
                    />
                </div>
            </div>

            {/* Articles list */}
            <div className="relative pt-6 max-w-5xl w-full mx-auto text-black dark:text-white transition-colors duration-300">
                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                        <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                        Loading articles...
                    </p>
                ) : filteredArticles.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No articles found.</p>
                ) : (
                    <ul className="grid gap-6">
                        {filteredArticles.map((article) => (
                            <li
                                key={article.id}
                                className="rounded-lg bg-gray-100 dark:bg-zinc-800 shadow-md hover:shadow-lg transition-all p-5"
                            >
                                {article.is_published ? (
                                    <>
                                        {/* Published */}
                                        <div className="flex items-start justify-between mb-3">
                                            <Link href={`/article/${article.id}`}>
                                                <h2 className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition">
                                                    {article.title || 'Untitled'}
                                                </h2>
                                            </Link>
                                            {article.ipfs_cid && (
                                                <span className="text-xs font-medium bg-green-600 text-white px-2 py-1 rounded ml-3">
                                                    On-chain
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-400 mb-4 line-clamp-3">
                                            {article.summary}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        {/* Draft */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-1">
                                                    {article.title || 'Untitled Draft'}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {article.summary}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {(!article.status || article.status === 'draft') && (
                                                <Link href={`/create?id=${article.id}`}>
                                                    <Button size="sm" variant="primary" leftIcon={<Edit className="h-4 w-4" />}>
                                                        Continue Editing
                                                    </Button>
                                                </Link>
                                            )}
                                            {article.status === 'under_review' && (
                                                <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                                                    <SendHorizonal className="h-4 w-4" />
                                                    Submitted for Review
                                                </div>
                                            )}
                                            {article.status === 'approved' && (
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    leftIcon={<UploadCloud className="h-4 w-4" />}
                                                    onClick={() => handlePublish(article.id, article.title, article.content)}
                                                >
                                                    Publish
                                                </Button>
                                            )}
                                            {article.status === 'rejected' && (
                                                <Link href={`/create?id=${article.id}`}>
                                                    <Button
                                                        size="sm"
                                                        variant="warning"
                                                        leftIcon={<RefreshCcw className="h-4 w-4" />}
                                                    >
                                                        Edit & Resubmit
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
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
