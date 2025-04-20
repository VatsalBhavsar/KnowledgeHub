'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { publishArticle, uploadArticleToIPFS } from '@/lib/web3Uploader';
import UploadProgressModal from '@/components/UploadProgressModal';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export default function ReviewsPage() {
  const { address, isConnected } = useAccount();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchDrafts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .in('status', ['under_review', 'approved'])
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts for review:', error.message);
    } else {
      setDrafts(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleReviewAction = async (
    id: string,
    action: 'approved' | 'rejected'
  ) => {
    const { error } = await supabase
      .from('drafts')
      .update({
        status: action,
        reviewed_by: [isConnected ? address : 'reviewer@test'],
      })
      .eq('id', id);

    if (error) {
      alert(`Failed to update status: ${error.message}`);
    } else {
      alert(`Draft ${action}!`);
      fetchDrafts();
    }
  };

  const handlePublish = async (id: string, title: string, content: string) => {
    setShowModal(true);
    setUploadStatus('uploading');
    setUploadMessage('Preparing upload...');

    try {
      setUploadMessage('Uploading to IPFS...');
      console.log(process.env.NEXT_PUBLIC_WEB3_STORAGE_DID);
      const ipfsCid = await uploadArticleToIPFS(title, content);
      setUploadMessage('Publishing article...');
      await publishArticle(title, ipfsCid);

      setUploadMessage('Saving metadata...');
      const { error } = await supabase
        .from('drafts')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
          status: 'published',
          ipfs_cid: ipfsCid,
        })
        .eq('id', id);

      if (error) {
        setUploadStatus('error');
        setUploadMessage(`Failed to publish: ${error.message}`);
      } else {
        setUploadStatus('success');
        setUploadMessage('Article successfully published to IPFS!');
        fetchDrafts();
      }
    } catch (err) {
      console.error('Error during publishing:', err);
      setUploadStatus('error');
      setUploadMessage('Something went wrong while publishing to IPFS.');
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto py-8 px-4 text-white">
        <h1 className="text-2xl font-bold mb-6">🔍 Review Submissions</h1>

        {loading ? (
          <p className="text-gray-400">Loading submissions...</p>
        ) : drafts.length === 0 ? (
          <p className="text-gray-400">No drafts under review.</p>
        ) : (
          <ul className="space-y-6">
            {drafts.map((draft) => (
              <li
                key={draft.id}
                className="rounded-lg bg-zinc-800 shadow-sm p-5 border border-zinc-700 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold text-white mb-1">
                  {draft.title || 'Untitled Draft'}
                </h2>

                <p className="text-gray-400 text-sm">{draft.summary}</p>

                <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                  <span>
                    📅 Submitted:{' '}
                    {new Date(
                      draft.submitted_at || draft.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={() => handleReviewAction(draft.id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleReviewAction(draft.id, 'rejected')}
                  >
                    Reject
                  </button>
                  {draft.status === 'approved' && !draft.is_published && (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      onClick={() =>
                        handlePublish(draft.id, draft.title, draft.content)
                      }
                    >
                      Publish
                    </button>
                  )}

                  {draft.status === 'published' && draft.is_published && (
                    <Link
                      href={`/article/${draft.id}`}
                      className="text-blue-400 underline text-sm mt-2 block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Public Article
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <UploadProgressModal
        isOpen={showModal}
        status={uploadStatus}
        message={uploadMessage}
        onClose={() => {
          setShowModal(false);
          setUploadStatus('idle');
          setUploadMessage('');
        }}
      />
    </>
  );
}
