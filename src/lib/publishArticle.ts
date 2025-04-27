'use client';

import { uploadArticleToIPFS } from '@/lib/web3Uploader';
import { articleManagerAddress } from '@/lib/contracts/articleManagerAddress';
import { articleManagerABI } from '@/lib/contracts/articleManagerABI';

export async function publishArticle({
    id,
    title,
    content,
    setShowModal,
    setUploadStatus,
    setUploadMessage,
    setUploadProgress,
    setTxHash,
    setIpfsCid,
    setIdToUpdate,
    setArticleIndex,
    isConnected,
    publicClient,
    writeContractAsync,
}: {
    id: string;
    title: string;
    content: string;
    setShowModal: (value: boolean) => void;
    setUploadStatus: (value: 'idle' | 'uploading' | 'success' | 'error') => void;
    setUploadMessage: (value: string) => void;
    setUploadProgress: (value: number) => void;
    setTxHash: (value: `0x${string}`) => void;
    setIpfsCid: (value: string) => void;
    setIdToUpdate: (value: string) => void;
    setArticleIndex: (value: number) => void;
    isConnected: boolean;
    publicClient: any; // 🛠️ Marked as 'any' now
    writeContractAsync: any; // 🛠️ Marked as 'any' now
}) {
    setShowModal(true);
    setUploadStatus('uploading');
    setUploadMessage('Preparing upload...');
    setUploadProgress(0);

    let interval: NodeJS.Timeout | null = null;

    try {
        let currentProgress = 0; // 🆕 Local variable

        interval = setInterval(() => {
            if (currentProgress < 70) {
                currentProgress = Math.min(currentProgress + Math.random() * 5, 70);
                setUploadProgress(currentProgress);
            }
        }, 300);

        setUploadMessage('Uploading to IPFS...');
        const ipfs = await uploadArticleToIPFS(content);

        if (interval) clearInterval(interval);

        if (!isConnected) {
            setUploadStatus('error');
            setUploadMessage('Wallet not connected.');
            return;
        }

        if (!publicClient) {
            setUploadStatus('error');
            setUploadMessage('Failed to access public client');
            return;
        }

        const count = await publicClient.readContract({
            address: articleManagerAddress,
            abi: articleManagerABI,
            functionName: 'articleCount',
        });
        const nextIndex = Number(count);
        setArticleIndex(nextIndex);

        setUploadProgress(90);
        setUploadMessage('Sending transaction to blockchain...');

        const hash = await writeContractAsync({
            address: articleManagerAddress,
            abi: articleManagerABI,
            functionName: 'publishArticle',
            args: [title, ipfs],
        });

        setUploadProgress(95);
        setUploadMessage('Waiting for confirmation...');
        setTxHash(hash as `0x${string}`);
        setIpfsCid(ipfs);
        setIdToUpdate(id);
    } catch (error) {
        console.error('❌ Error publishing:', error);
        if (interval) clearInterval(interval);

        setUploadStatus('error');
        setUploadMessage('Something went wrong during publish.');
    }
}
