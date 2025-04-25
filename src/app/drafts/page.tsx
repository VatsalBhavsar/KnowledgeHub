'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import WalletGuard from '@/components/WalletGuard'

export default function DraftsPage() {
    const [drafts, setDrafts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { address, isConnected } = useAccount()

    useEffect(() => {
        const fetchDrafts = async () => {
            if (!address) return // User not authenticated

            setLoading(true)

            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .eq('is_published', false)
                .eq('wallet_address', address) // ✅ Filter by user's wallet
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
            <div className="max-w-5xl mx-auto py-8 px-4 text-white">
                <h1 className="text-2xl font-bold mb-6">📝 Your Drafts</h1>

                {loading ? (
                    <p className="text-gray-400">Loading drafts...</p>
                ) : drafts.length === 0 ? (
                    <p className="text-gray-400">No drafts found.</p>
                ) : (
                    <ul className="space-y-6">
                        {drafts.map(draft => (
                            <li
                                key={draft.id}
                                className="rounded-lg bg-zinc-800 shadow-sm p-5 border border-zinc-700 hover:shadow-md transition-shadow"
                            >
                                <h2 className="text-xl font-semibold text-white mb-1">
                                    {draft.title || 'Untitled Draft'}
                                </h2>

                                <p className="text-gray-400 text-sm">{draft.summary}</p>

                                <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                                    <span>📅 Created: {new Date(draft.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="mt-4 flex gap-3 flex-wrap">
                                    {(!draft.status || draft.status === 'draft') && (
                                        <Link href={`/create?id=${draft.id}`}>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                                Continue Editing
                                            </button>
                                        </Link>
                                    )}

                                    {draft.status === 'under_review' && (
                                        <span className="text-yellow-400 text-sm">⏳ Submitted for Review</span>
                                    )}

                                    {draft.status === 'approved' && (
                                        <Link href={`/create?id=${draft.id}`}>
                                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                                                Publish
                                            </button>
                                        </Link>
                                    )}

                                    {draft.status === 'rejected' && (
                                        <Link href={`/create?id=${draft.id}`}>
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                                                Edit & Resubmit
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
