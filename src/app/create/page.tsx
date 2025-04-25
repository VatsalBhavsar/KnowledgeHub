'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/config/supabase'
import { useSearchParams, useRouter } from 'next/navigation'
import TagInput from '@/components/TagInput'
import { useAccount, useEnsName } from 'wagmi'
import WalletGuard from '@/components/WalletGuard'
import toast from 'react-hot-toast'

const Editor = dynamic(() => import('@/components/Editor.client'), { ssr: false })

function CreateForm() {
    const [hasMounted, setHasMounted] = useState(false)
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [content, setContent] = useState('')
    const [errors, setErrors] = useState({ title: '', summary: '' })

    const searchParams = useSearchParams()
    const draftId = searchParams.get('id')
    const router = useRouter()

    const { address } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const authorName = ensName || (address ? `0x${address.slice(0, 6)}...${address.slice(-4)}` : 'anonymous')

    useEffect(() => {
        setHasMounted(true)
    }, [])

    useEffect(() => {
        const fetchDraft = async () => {
            if (!draftId) return

            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .eq('id', draftId)
                .single()

            if (!error && data) {
                setTitle(data.title)
                setSummary(data.summary)
                setTags(data.tags || [])
                setContent(data.content)
            } else {
                console.error('Error fetching draft:', error?.message)
            }
        }

        fetchDraft()
    }, [draftId])

    if (!hasMounted) return null

    const handleSaveDraft = async () => {
        const newErrors = { title: '', summary: '' }
        if (!title.trim()) newErrors.title = 'Title is required.'
        if (newErrors.title) {
            setErrors(newErrors)
            return
        }

        setErrors({ title: '', summary: '' })

        const payload = {
            title: title.trim(),
            summary: summary.trim(),
            tags,
            content,
            author: authorName,
            is_published: false,
            status: 'draft',
            wallet_address: address || null,
        }

        if (draftId) {
            const { error } = await supabase.from('drafts').update(payload).eq('id', draftId)
            if (error) {
                toast.error(`Failed to save draft: ${error.message}`)
            } else {
                toast.success('Draft saved!')
            }
        } else {
            const { data, error } = await supabase.from('drafts').insert([payload]).select().single()
            if (error) {
                toast.error(`Failed to save draft: ${error.message}`)
            } else if (data?.id) {
                toast.success('Draft saved!')
                router.push(`/create?id=${data.id}`)
            }
        }
    }

    const isContentEmpty = (html: string) => {
        const temp = document.createElement('div')
        temp.innerHTML = html
        return temp.innerText.trim() === ''
    }

    const handleSubmitForReview = async () => {
        const newErrors = { title: '', summary: '' }

        if (!title.trim()) newErrors.title = 'Title is required.'
        if (!summary.trim()) newErrors.summary = 'Summary is required.'
        if (isContentEmpty(content)) {
            toast.error('Content cannot be empty.')
            return
        }
        if (tags.length > 5) {
            toast.error('Please limit tags to a maximum of 5.')
            return
        }
        if (newErrors.title || newErrors.summary) {
            setErrors(newErrors)
            return
        }

        setErrors({ title: '', summary: '' })

        const payload = {
            title: title.trim(),
            summary: summary.trim(),
            tags: tags.map(tag => tag.trim().toLowerCase()),
            content,
            author: authorName,
            is_published: false,
            status: 'under_review',
            submitted_at: new Date().toISOString(),
            wallet_address: address || null,
        }

        if (!draftId) {
            const { error } = await supabase.from('drafts').insert([payload])
            if (error) {
                toast.error(`Failed to submit for review: ${error.message}`)
            } else {
                toast.success('Article submitted for review!')
            }
        } else {
            const { error } = await supabase
                .from('drafts')
                .update({
                    status: 'under_review',
                    submitted_at: new Date().toISOString(),
                    wallet_address: address || null,
                    author: authorName,
                })
                .eq('id', draftId)

            if (error) {
                toast.error('Submission failed. Please try again.')
            } else {
                toast.success('Draft submitted for review!')
            }
        }
    }

    return (
        <WalletGuard>
            <div className="max-w-5xl mx-auto py-10 px-6 text-black dark:text-white transition-colors duration-300">
                <h1 className="text-4xl font-bold tracking-tight mb-8">📝 Start Writing</h1>

                {/* Title */}
                <input
                    type="text"
                    placeholder="Enter your article title here..."
                    className={`w-full text-3xl font-semibold mb-4 bg-transparent border-none border-b-2 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                        if (errors.title) setErrors(prev => ({ ...prev, title: '' }))
                    }}
                />
                {errors.title && <p className="text-red-400 text-sm mb-4">{errors.title}</p>}

                {/* Summary */}
                <textarea
                    rows={2}
                    placeholder="Write a short summary for your article..."
                    className="w-full resize-none mb-6 bg-transparent text-base border-none border-b-2 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    value={summary}
                    onChange={(e) => {
                        setSummary(e.target.value)
                        if (errors.summary) setErrors(prev => ({ ...prev, summary: '' }))
                    }}
                />
                {errors.summary && <p className="text-red-400 text-sm mb-4">{errors.summary}</p>}

                {/* Tags */}
                <TagInput tags={tags} setTags={setTags} />

                {/* Editor */}
                <div className="mt-6">
                    <Editor content={content} setContent={setContent} />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-10">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        onClick={handleSaveDraft}
                    >
                        💾 Save Draft
                    </button>
                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                        onClick={handleSubmitForReview}
                    >
                        🚀 Submit for Review
                    </button>
                </div>
            </div>
        </WalletGuard>
    )
}

export default function CreateArticlePage() {
    return (
        <Suspense fallback={<p className="text-center text-gray-400 dark:text-gray-500 mt-10">Loading...</p>}>
            <CreateForm />
        </Suspense>
    )
}
