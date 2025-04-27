'use client';

import { useState, useEffect, useRef } from 'react';
import { X as XIcon, SendHorizonal as SendIcon, Bot as BotIcon, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

export default function AskArticleDrawer({ articleContent }: { articleContent: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const toggleDrawer = () => {
        setIsOpen((prev) => !prev);
        if (isOpen) {
            setQuestion('');
            setMessages([]);
            setLoading(false);
        }
    };

    const handleAsk = async () => {
        if (!question.trim() || !articleContent.trim()) return;
        setLoading(true);

        setMessages((prev) => [...prev, { sender: 'user', text: question }]);

        try {
            const response = await fetch('/api/ask-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ article: articleContent, question }),
            });

            const data = await response.json();
            const aiAnswer = data.answer?.trim() || 'Sorry, no response received.';

            setMessages((prev) => [...prev, { sender: 'ai', text: aiAnswer }]);
            setQuestion('');
        } catch (error) {
            console.error('Error asking question:', error);
            setMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, something went wrong.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
            e.preventDefault();
            handleAsk();
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, loading]);

    return (
        <>
            {/* Button to open Drawer */}
            <Button
                size="sm"
                onClick={toggleDrawer}
                variant="secondary"
                leftIcon={<BotIcon className="h-4 w-4" />}
                className="ml-2"
            >
                Ask AI
            </Button>

            {/* Overlay and Drawer */}
            <div className={clsx(
                'fixed inset-0 z-50 flex justify-end transition-all duration-300',
                isOpen ? 'bg-black/30 dark:bg-black/50' : 'pointer-events-none bg-transparent'
            )}>
                <div className="flex-1" onClick={toggleDrawer}></div>

                <div className={clsx(
                    'w-full max-w-md h-full shadow-lg p-6 flex flex-col bg-white dark:bg-zinc-900 transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Ask this Article</h2>
                        <button onClick={toggleDrawer} aria-label="Close">
                            <XIcon className="h-6 w-6 text-zinc-800 dark:text-zinc-100" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 p-2 mb-4">
                        {messages.length === 0 && !loading && (
                            <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center">
                                Start by asking a question about your article!
                            </p>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[75%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {msg.sender === 'user' ? (
                                            <UserIcon className="h-4 w-4" />
                                        ) : (
                                            <BotIcon className="h-4 w-4" />
                                        )}
                                        <span>{msg.text}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing animation if loading */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-[75%] p-3 rounded-lg text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <BotIcon className="h-4 w-4" />
                                    <div className="flex space-x-1">
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce delay-200">.</span>
                                        <span className="animate-bounce delay-400">.</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input + Ask Button */}
                    <div className="flex gap-2 mt-auto">
                        <input
                            type="text"
                            placeholder="Type your question..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        <Button
                            onClick={handleAsk}
                            disabled={!question.trim() || !articleContent.trim() || loading}
                            size="sm"
                            variant="primary"
                            loading={loading}
                            className="w-12 h-10"
                        >
                            {!loading && <SendIcon className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
