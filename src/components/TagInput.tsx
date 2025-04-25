'use client'

import { useState, KeyboardEvent } from 'react'

interface TagInputProps {
    tags: string[]
    setTags: (tags: string[]) => void
}

export default function TagInput({ tags, setTags }: TagInputProps) {
    const [inputValue, setInputValue] = useState('')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const trimmed = inputValue.trim()

        if ((e.key === 'Enter' || e.key === ',') && trimmed) {
            e.preventDefault()

            if (!tags.includes(trimmed.toLowerCase())) {
                setTags([...tags, trimmed.toLowerCase()])
            }

            setInputValue('')
        }

        if (e.key === 'Backspace' && !inputValue && tags.length) {
            const updated = [...tags]
            updated.pop()
            setTags(updated)
        }
    }

    const removeTag = (index: number) => {
        const updated = [...tags]
        updated.splice(index, 1)
        setTags(updated)
    }

    return (
        <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-100 block mb-1">
                Tags
            </label>

            <div className="flex flex-wrap items-center gap-2 p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 focus-within:ring-1 focus-within:ring-blue-500">
                {tags.map((tag, i) => (
                    <div
                        key={i}
                        className="flex items-center bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-white px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                        <span>{tag}</span>
                        <button
                            onClick={() => removeTag(i)}
                            className="ml-2 text-blue-600 dark:text-white hover:text-red-500 transition"
                            type="button"
                            aria-label={`Remove tag ${tag}`}
                        >
                            ×
                        </button>
                    </div>
                ))}

                <input
                    type="text"
                    className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-zinc-800 dark:text-white placeholder:text-zinc-400"
                    placeholder="Add a tag"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Press Enter or comma to add a tag.
            </p>
        </div>
    )
}
