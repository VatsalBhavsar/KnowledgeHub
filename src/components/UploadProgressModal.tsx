'use client'

import { Dispatch, SetStateAction } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface UploadProgressModalProps {
    isOpen: boolean
    status: 'idle' | 'uploading' | 'success' | 'error'
    message: string
    onClose: () => void
}

export default function UploadProgressModal({
    isOpen,
    status,
    message,
    onClose,
}: UploadProgressModalProps) {
    return (
        <Dialog open={isOpen} onClose={() => { }} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-xl text-center space-y-4">
                    <div className="flex justify-between items-center">
                        <Dialog.Title className="text-lg font-bold text-zinc-800 dark:text-white">
                            Publishing Article
                        </Dialog.Title>
                        {status !== 'uploading' && (
                            <button onClick={onClose}>
                                <XMarkIcon className="h-5 w-5 text-zinc-500 hover:text-zinc-700 dark:hover:text-white" />
                            </button>
                        )}
                    </div>

                    {status === 'uploading' && (
                        <div className="animate-pulse text-sm text-zinc-600 dark:text-gray-300">{message}</div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircleIcon className="h-12 w-12 text-green-500" />
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-red-500 text-sm font-medium">{message}</div>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
