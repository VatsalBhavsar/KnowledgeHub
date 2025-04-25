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

	if (loading)
		return (
			<p className="text-center mt-10 text-black dark:text-white transition-colors duration-300">
				Loading articles...
			</p>
		)

	return (
		<div className="max-w-5xl mx-auto px-4 py-10 text-black dark:text-white transition-colors duration-300">
			<h1 className="text-3xl font-bold mb-6">📚 Published Articles</h1>

			{articles.length === 0 ? (
				<p className="text-gray-600 dark:text-gray-400">
					No published articles found.
				</p>
			) : (
				<ul className="space-y-6">
					{articles.map(article => (
						<li
							key={article.id}
							className="rounded-lg border shadow-sm p-5 transition-shadow hover:shadow-md bg-gray-100 border-gray-300 dark:bg-zinc-800 dark:border-zinc-700"
						>
							<div className="flex items-start justify-between">
								<Link href={`/article/${article.id}`}>
									<h2 className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition">
										{article.title}
									</h2>
								</Link>

								{article.ipfs_cid && (
									<span className="text-xs font-medium bg-green-600 text-white px-2 py-1 rounded ml-2">
										On-chain
									</span>
								)}
							</div>

							<p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
								{article.summary}
							</p>

							<div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-3">
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
