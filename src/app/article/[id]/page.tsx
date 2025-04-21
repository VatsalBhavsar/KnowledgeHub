'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/config/supabase'
import { useReadContract } from 'wagmi'
import { articleManagerABI } from '@/lib/contracts/articleManagerABI'
import { articleManagerAddress } from '@/lib/contracts/articleManagerAddress'

export default function ViewArticlePage() {
    const { id } = useParams()
    const [article, setArticle] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .eq('id', id)
                .eq('is_published', true)
                .single()

            if (error) {
                setErrorMsg('Article not found or not published.')
            } else {
                setArticle(data)
            }

            setLoading(false)
        }

        fetchArticle()
    }, [id])

    // ✅ Read from smart contract (on-chain verification)
    const {
        data: articleOnChain,
        isLoading: isLoadingChain,
        isError: isChainError,
        isSuccess: isChainSuccess,
    } = useReadContract({
        address: articleManagerAddress,
        abi: articleManagerABI,
        functionName: 'articles',
        args: [article?.article_index],
        query: {
            enabled: !!article?.article_index,
        },
    })

    const gatewayURL = article?.ipfs_cid ? `https://w3s.link/ipfs/${article.ipfs_cid}` : null
    const ipfsURI = article?.ipfs_cid ? `ipfs://${article.ipfs_cid}` : null
    const verified = articleOnChain as {
        author: `0x${string}`
        ipfsHash: string
        title: string
        timestamp: bigint
    }

    if (loading) return <p className="text-white text-center mt-10">Loading article...</p>
    if (errorMsg) return <p className="text-red-400 text-center mt-10">{errorMsg}</p>

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 text-white">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold">{article.title}</h1>
                    <p className="text-gray-400 text-sm">{article.summary}</p>
                </div>

                {/* ✅ On-chain verified badge */}
                {isChainSuccess && verified?.ipfsHash === article.ipfs_cid && (
                    <span className="text-xs font-semibold bg-green-700 text-white px-3 py-1 rounded ml-4">
                        ✅ Verified on-chain
                    </span>
                )}
            </div>

            {/* Author and published date */}
            <p className="text-sm text-gray-500 mb-6">
                {article.author && <span>By <strong>{article.author}</strong> | </span>}
                Published on {new Date(article.published_at).toLocaleString()}
            </p>

            {/* Article content */}
            <div
                className="prose prose-invert"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* ✅ IPFS Info */}
            {article.ipfs_cid && (
                <div className="mt-8 border-t border-zinc-700 pt-4">
                    <h4 className="text-sm text-green-400 mb-2">📦 Decentralized Copy</h4>
                    <code className="block text-xs bg-zinc-800 p-2 rounded break-all mb-2 border border-zinc-700">
                        {article.ipfs_cid}
                    </code>

                    <div className="flex flex-col gap-1">
                        <a
                            href={gatewayURL!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 text-sm underline"
                        >
                            🔗 View on IPFS Gateway
                        </a>
                        <span className="text-sm text-gray-400">
                            IPFS URI: <code className="text-white">{ipfsURI}</code>
                        </span>
                    </div>
                </div>
            )}

            {/* ✅ Verified author info */}
            {isChainSuccess && verified?.ipfsHash === article.ipfs_cid && (
                <div className="mt-6 text-sm text-gray-400">
                    <p>
                        🧾 This article is permanently stored on-chain by{' '}
                        <span className="text-white font-mono">
                            {verified.author.slice(0, 6)}...{verified.author.slice(-4)}
                        </span>
                    </p>
                </div>
            )}

            {/* Tags */}
            {article.tags?.length > 0 && (
                <div className="mt-8">
                    <h4 className="text-gray-400 text-sm mb-1">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="bg-zinc-800 px-3 py-1 rounded-full text-xs border border-zinc-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
