'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/config/supabase';
import { useReadContract } from 'wagmi';
import { articleManagerABI } from '@/lib/contracts/articleManagerABI';
import { articleManagerAddress } from '@/lib/contracts/articleManagerAddress';
import {
    CheckCircle,
    PackageCheck,
    ExternalLink,
    FileText,
    Loader2,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ViewEditor = dynamic(() => import('@/components/ViewEditor.client'), { ssr: false });

export default function ViewArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .eq('id', id)
                .eq('is_published', true)
                .single();

            if (error) {
                setErrorMsg('Article not found or not published.');
            } else {
                setArticle(data);
            }
            setLoading(false);
        };

        fetchArticle();
    }, [id]);

    const {
        data: articleOnChain,
        isLoading: isLoadingChain,
        isSuccess: isChainSuccess,
    } = useReadContract({
        address: articleManagerAddress,
        abi: articleManagerABI,
        functionName: 'articles',
        args: [article?.article_index],
        query: { enabled: !!article?.article_index },
    });

    const gatewayURL = article?.ipfs_cid ? `https://w3s.link/ipfs/${article.ipfs_cid}` : null;
    const ipfsURI = article?.ipfs_cid ? `ipfs://${article.ipfs_cid}` : null;
    const verified = articleOnChain as {
        author: `0x${string}`;
        ipfsHash: string;
        title: string;
        timestamp: bigint;
    };

    if (loading) {
        return (
            <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                Loading article...
            </p>
        );
    }

    if (errorMsg) {
        return (
            <p className="text-center mt-10 text-red-600 dark:text-red-400">
                {errorMsg}
            </p>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 text-black dark:text-white transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-3 leading-tight">{article.title}</h1> {/* 📈 Increased font size & spacing */}
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{article.summary}</p> {/* 📈 Made summary slightly bigger and more readable */}
                </div>

                {/* Verified badge */}
                {isChainSuccess && verified?.ipfsHash === article.ipfs_cid && (
                    <span className="flex items-center gap-1 text-xs font-semibold bg-green-700 text-white px-3 py-1 rounded whitespace-nowrap">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                    </span>
                )}
            </div>

            {/* Author and publish date */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                {article.author && (
                    <span>
                        By <strong>{article.author}</strong> &bull;{' '}
                    </span>
                )}
                Published on {new Date(article.published_at).toLocaleDateString()}
            </p>

            {/* Main Content */}
            <ViewEditor content={article.content} />

            {/* Decentralized Copy Section */}
            {article.ipfs_cid && (
                <div className="mt-12 border-t pt-6 border-gray-300 dark:border-zinc-700">
                    <h4 className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-3 text-sm font-semibold">
                        <PackageCheck className="h-4 w-4" />
                        Decentralized Copy (IPFS)
                    </h4>

                    <code className="block text-xs bg-gray-100 dark:bg-zinc-800 p-3 rounded border border-gray-300 dark:border-zinc-700 mb-4 break-words">
                        {article.ipfs_cid}
                    </code>

                    <div className="flex flex-col gap-1">
                        <a
                            href={gatewayURL!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm underline"
                        >
                            <ExternalLink className="h-4 w-4" />
                            View on IPFS Gateway
                        </a>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            IPFS URI: <code className="text-black dark:text-white">{ipfsURI}</code>
                        </p>
                    </div>
                </div>
            )}

            {/* On-chain Verified Author */}
            {isChainSuccess && verified?.ipfsHash === article.ipfs_cid && (
                <div className="mt-10 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Stored by{' '}
                        <span className="text-black dark:text-white font-mono">
                            {verified.author.slice(0, 6)}...{verified.author.slice(-4)}
                        </span>
                    </p>
                </div>
            )}

            {/* Tags */}
            {article.tags?.length > 0 && (
                <div className="mt-12">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-white border border-gray-300 dark:border-zinc-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
