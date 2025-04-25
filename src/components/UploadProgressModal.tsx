'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

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
            {/* Background Blur */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 transition-all space-y-6">

                    {/* Title & Close */}
                    <div className="flex justify-between items-center">
                        <Dialog.Title className="text-lg font-bold text-zinc-800 dark:text-white">
                            Publishing Article
                        </Dialog.Title>
                        {status !== 'uploading' && (
                            <button onClick={onClose}>
                                <XMarkIcon className="h-5 w-5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition" />
                            </button>
                        )}
                    </div>

                    {/* Progress / Status */}
                    <div className="flex flex-col items-center justify-center gap-4">
                        {status === 'uploading' && (
                            <>
                                {/* Progress bar */}
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-pulse rounded-full" style={{ width: '70%' }} />
                                </div>

                                <p className="text-sm text-zinc-500 dark:text-gray-300 animate-pulse">{message}</p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <CheckCircleIcon className="h-12 w-12 text-green-500" />
                                <p className="text-green-600 dark:text-green-400 text-sm font-medium">{message}</p>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <XCircleIcon className="h-12 w-12 text-red-500" />
                                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{message}</p>
                            </>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
