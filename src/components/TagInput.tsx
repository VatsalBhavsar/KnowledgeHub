'use client'

import { useState, KeyboardEvent, FocusEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion' // ✅ Import AnimatePresence and motion

interface TagInputProps {
    tags: string[]
    setTags: (tags: string[]) => void
}

export default function TagInput({ tags, setTags }: TagInputProps) {
    const [inputValue, setInputValue] = useState('')

    const addTag = (tag: string) => {
        const trimmed = tag.trim()

        if (trimmed && !tags.includes(trimmed.toLowerCase())) {
            setTags([...tags, trimmed.toLowerCase()])
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag(inputValue)
            setInputValue('')
        }

        if (e.key === 'Backspace' && !inputValue && tags.length) {
            const updated = [...tags]
            updated.pop()
            setTags(updated)
        }
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        if (inputValue.trim() !== '') {
            addTag(inputValue)
            setInputValue('')
        }
    }

    const removeTag = (index: number) => {
        const updated = [...tags]
        updated.splice(index, 1)
        setTags(updated)
    }

    return (
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Tags
            </label>

            <div className="flex flex-wrap items-center gap-2 p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                <AnimatePresence initial={false}>
                    {tags.map((tag, i) => (
                        <motion.div
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-3 py-1 rounded-full text-sm"
                        >
                            <span>{tag}</span>
                            <button
                                onClick={() => removeTag(i)}
                                className="ml-2 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition"
                                type="button"
                                aria-label={`Remove tag ${tag}`}
                            >
                                ×
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <input
                    type="text"
                    className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-zinc-800 dark:text-white placeholder:text-zinc-400"
                    placeholder="Add a tag"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                />
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Press Enter or comma to add a tag.
            </p>
        </div>
    )
}
