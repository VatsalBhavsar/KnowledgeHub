'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import { uploadArticleToIPFS } from '@/lib/web3Uploader'
import UploadProgressModal from '@/components/UploadProgressModal'
import Link from 'next/link'
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    usePublicClient
} from 'wagmi'
import { articleManagerABI } from '@/lib/contracts/articleManagerABI'
import { articleManagerAddress } from '@/lib/contracts/articleManagerAddress'
import toast from 'react-hot-toast'
import WalletGuard from '@/components/WalletGuard'

export default function ReviewsPage() {
    const [drafts, setDrafts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
    const [uploadMessage, setUploadMessage] = useState('')
    const [showModal, setShowModal] = useState(false)

    const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
    const [ipfsCid, setIpfsCid] = useState('')
    const [idToUpdate, setIdToUpdate] = useState('')
    const [articleIndex, setArticleIndex] = useState<number | null>(null)

    const { address, isConnected } = useAccount()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()

    const { isLoading: isWaiting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
        query: { enabled: !!txHash },
    })

    useEffect(() => {
        const updateSupabase = async () => {
            if (isConfirmed && ipfsCid && idToUpdate && articleIndex !== null) {
                setUploadMessage('Saving metadata...')
                const { error } = await supabase
                    .from('drafts')
                    .update({
                        is_published: true,
                        published_at: new Date().toISOString(),
                        status: 'published',
                        ipfs_cid: ipfsCid,
                        article_index: articleIndex,
                    })
                    .eq('id', idToUpdate)

                if (error) {
                    setUploadStatus('error')
                    setUploadMessage(`Failed to publish: ${error.message}`)
                } else {
                    setUploadStatus('success')
                    setUploadMessage('Article published to IPFS and blockchain!')
                    fetchDrafts()
                }
            }
        }

        updateSupabase()
    }, [isConfirmed])

    const fetchDrafts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('drafts')
            .select('*')
            .in('status', ['under_review', 'approved'])
            .order('submitted_at', { ascending: false })

        if (error) {
            console.error('Error fetching drafts:', error.message)
        } else {
            setDrafts(data)
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchDrafts()
    }, [])

    const handleReviewAction = async (id: string, action: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('drafts')
            .update({
                status: action,
                reviewed_by: ['reviewer@test'],
            })
            .eq('id', id)

        if (error) {
            toast.error(`Failed to update status: ${error.message}`)
        } else {
            toast.success(`Draft ${action}!`)
            fetchDrafts()
        }
    }

    const handlePublish = async (id: string, title: string, content: string) => {
        setShowModal(true)
        setUploadStatus('uploading')
        setUploadMessage('Preparing upload...')

        try {
            setUploadMessage('Uploading to IPFS...')
            const ipfs = await uploadArticleToIPFS(content)

            if (!isConnected) {
                setUploadStatus('error')
                setUploadMessage('Wallet not connected.')
                return
            }
            if (!publicClient) {
                setUploadStatus('error')
                setUploadMessage('Failed to access public client')
                return
            }

            const count = await publicClient.readContract({
                address: articleManagerAddress,
                abi: articleManagerABI,
                functionName: 'articleCount',
            })
            const nextIndex = Number(count)
            setArticleIndex(nextIndex)

            setUploadMessage('Sending transaction to blockchain...')

            const hash = await writeContractAsync({
                address: articleManagerAddress,
                abi: articleManagerABI,
                functionName: 'publishArticle',
                args: [title, ipfs],
            })

            setUploadMessage('Waiting for confirmation...')
            setTxHash(hash as `0x${string}`)
            setIpfsCid(ipfs)
            setIdToUpdate(id)
        } catch (err) {
            console.error('❌ Error publishing:', err)
            setUploadStatus('error')
            setUploadMessage('Something went wrong during publish.')
        }
    }

    return (
        <WalletGuard>
            <div className="max-w-5xl mx-auto py-8 px-4 text-black dark:text-white transition-colors duration-300">
                <h1 className="text-2xl font-bold mb-6">🔍 Review Submissions</h1>

                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading submissions...</p>
                ) : drafts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No drafts under review.</p>
                ) : (
                    <ul className="space-y-6">
                        {drafts.map((draft) => (
                            <li
                                key={draft.id}
                                className="rounded-lg bg-gray-100 dark:bg-zinc-800 shadow-sm p-5 border border-gray-300 dark:border-zinc-700 hover:shadow-md transition"
                            >
                                <h2 className="text-xl font-semibold mb-1">{draft.title || 'Untitled Draft'}</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{draft.summary}</p>

                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                                    <span>📅 Submitted: {new Date(draft.submitted_at || draft.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="mt-4 flex gap-3 flex-wrap">
                                    {draft.wallet_address !== address && (
                                        <>
                                            <button
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                                onClick={() => handleReviewAction(draft.id, 'approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                                onClick={() => handleReviewAction(draft.id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {draft.status === 'approved' && !draft.is_published && draft.wallet_address === address && (
                                        <button
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                            onClick={() => handlePublish(draft.id, draft.title, draft.content)}
                                        >
                                            Publish
                                        </button>
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
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <UploadProgressModal
                isOpen={showModal}
                status={uploadStatus}
                message={uploadMessage}
                onClose={() => {
                    setShowModal(false)
                    setUploadStatus('idle')
                    setUploadMessage('')
                }}
            />
        </WalletGuard>
    )
}
