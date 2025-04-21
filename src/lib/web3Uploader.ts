import { create } from '@web3-storage/w3up-client';
import { ethers } from 'ethers';
import abiValues from '../../artifacts/contracts/KnowledgeHub.sol/KnowledgeHub.json';

const abi = abiValues.abi;

export async function uploadArticleToIPFS(title: string, content: string) {
  const client = await create();

  const spaces = await client.spaces();
  const space = spaces.find(
    (s) => s.did() === process.env.NEXT_PUBLIC_WEB3_STORAGE_DID
  );

  if (!space) {
    throw new Error(
      'Web3.Storage space not found. Make sure the DID is correct and linked to this identity.'
    );
  }

  await client.setCurrentSpace(space.did());

  const file = new File([content], 'article.txt', { type: 'text/plain' });

  const cid = await client.uploadFile(file);

  console.log('✅ Uploaded to IPFS with CID:', cid.toString());

  return cid.toString();
}

export async function publishArticle(title: string, ipfsCid: string) {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
  if (!window.ethereum) return alert('Install MetaMask!');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    const tx = await contract.publishArticle(title, ipfsCid);
    await tx.wait();
    alert('Article published!');
  } catch (error) {
    console.error(error);
    alert('Failed to publish article.');
  }
}
