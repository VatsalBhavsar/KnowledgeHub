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
						<li
							key={article.id}
							className="rounded-lg bg-zinc-800 shadow-sm p-5 border border-zinc-700 hover:shadow-md transition-shadow"
						>
							<div className="flex items-start justify-between">
								<Link href={`/article/${article.id}`}>
									<h2 className="text-xl font-semibold text-white hover:text-blue-400 transition">
										{article.title}
									</h2>
								</Link>

								{article.ipfs_cid && (
									<span className="text-xs font-medium bg-green-600 text-white px-2 py-1 rounded ml-2">
										On-chain
									</span>
								)}
							</div>

							<p className="text-gray-400 text-sm mt-2">{article.summary}</p>

							<div className="flex justify-between items-center text-xs text-gray-400 mt-3">
								{article.author && <span>👤 {article.author}</span>}
								<span>📅 {new Date(article.published_at).toLocaleDateString()}</span>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
