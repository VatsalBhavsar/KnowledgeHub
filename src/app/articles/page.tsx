'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import Link from 'next/link'

export default function ArticlesPage() {
    const [articles, setArticles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false })

            if (!error) {
                setArticles(data)
            }

            setLoading(false)
        }

        fetchArticles()
    }, [])

    if (loading) return <p className="text-white text-center mt-10">Loading articles...</p>

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 text-white">
            <h1 className="text-3xl font-bold mb-6">📚 Published Articles</h1>

            {articles.length === 0 ? (
                <p className="text-gray-400">No published articles found.</p>
            ) : (
                <ul className="space-y-6">
                    {articles.map(article => (
                        <li key={article.id} className="bg-zinc-900 border border-zinc-800 rounded p-6">
                            <div className="flex items-start justify-between mb-2">
                                <Link href={`/article/${article.id}`}>
                                    <h2 className="text-xl font-semibold hover:text-blue-400 transition">{article.title}</h2>
                                </Link>

                                {article.ipfs_cid && (
                                    <span className="text-xs font-semibold bg-green-700 text-white px-2 py-1 rounded ml-2">
                                        On-chain
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-400 text-sm mb-2">{article.summary}</p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div>
                                    {article.author && <span>👤 {article.author}</span>}
                                </div>
                                <div>
                                    {new Date(article.published_at).toLocaleDateString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
