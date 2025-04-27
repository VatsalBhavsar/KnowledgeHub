'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import Link from 'next/link'
import { Compass, User, CalendarDays, Loader2 } from 'lucide-react'

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

	return (
		<>
			{/* Secondary Top Header */}
			<div className="sticky top-0 z-30">
				<div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 shadow-sm px-4"
					style={{ minHeight: '60px' }}>
					<h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-800 dark:text-zinc-100 ml-4">
						<Compass className="h-7 w-7 text-zinc-800 dark:text-zinc-200" />
						Explore
					</h2>
				</div>
			</div>
			<div className="max-w-5xl mx-auto px-4 py-10 text-black dark:text-white transition-colors duration-300">
				{loading ? (
					<p className="text-gray-500 dark:text-gray-400 text-center">
						<Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
						Loading articles...
					</p>
				) : articles.length === 0 ? (
					<p className="text-gray-600 dark:text-gray-400">No published articles found.</p>
				) : (
					<ul className="grid gap-6">
						{articles.map(article => (
							<li
								key={article.id}
								className="rounded-lg bg-gray-100 dark:bg-zinc-800 shadow-md hover:shadow-lg transition-all p-5"
							>
								<div className="flex items-start justify-between mb-3">
									<Link href={`/article/${article.id}`}>
										<h2 className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition">
											{article.title}
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

								<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
									<div className="flex items-center gap-2">
										<User className="h-4 w-4" />
										<span>{article.author}</span>
									</div>
									<div className="flex items-center gap-2">
										<CalendarDays className="h-4 w-4" />
										<span>{new Date(article.published_at).toLocaleDateString()}</span>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	)
}
