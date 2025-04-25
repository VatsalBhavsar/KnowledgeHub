'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import WalletGuard from '@/components/WalletGuard'

export default function DraftsPage() {
    const [drafts, setDrafts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { address } = useAccount()

    useEffect(() => {
        const fetchDrafts = async () => {
            if (!address) return

            setLoading(true)

            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .eq('is_published', false)
                .eq('wallet_address', address)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching drafts:', error.message)
            } else {
                setDrafts(data)
            }

            setLoading(false)
        }

        fetchDrafts()
    }, [address])

    return (
        <WalletGuard>
            <div className="max-w-5xl mx-auto py-10 px-6 text-black dark:text-white transition-colors duration-300">
                <h1 className="text-3xl font-bold tracking-tight mb-8">📝 Your Drafts</h1>

                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">Loading drafts...</p>
                ) : drafts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No drafts found.</p>
                ) : (
                    <ul className="space-y-6">
                        {drafts.map(draft => (
                            <li
                                key={draft.id}
                                className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-1">{draft.title || 'Untitled Draft'}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{draft.summary}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(draft.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Status & Actions */}
                                <div className="mt-5 flex flex-wrap gap-4">
                                    {(!draft.status || draft.status === 'draft') && (
                                        <Link href={`/create?id=${draft.id}`}>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded transition">
                                                ✏️ Continue Editing
                                            </button>
                                        </Link>
                                    )}

                                    {draft.status === 'under_review' && (
                                        <span className="text-yellow-500 font-semibold text-sm">
                                            ⏳ Submitted for Review
                                        </span>
                                    )}

                                    {draft.status === 'approved' && (
                                        <Link href={`/create?id=${draft.id}`}>
                                            <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded transition">
                                                🚀 Ready to Publish
                                            </button>
                                        </Link>
                                    )}

                                    {draft.status === 'rejected' && (
                                        <Link href={`/create?id=${draft.id}`}>
                                            <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded transition">
                                                🔄 Edit & Resubmit
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </WalletGuard>
    )
}
