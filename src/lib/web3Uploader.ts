import { create } from '@web3-storage/w3up-client'

export async function uploadArticleToIPFS(content: string) {
    const client = await create()

    const spaces = await client.spaces()
    const space = spaces.find(s => s.did() === process.env.NEXT_PUBLIC_WEB3_STORAGE_DID)

    if (!space) {
        throw new Error('Web3.Storage space not found. Make sure the DID is correct and linked to this identity.')
    }

    await client.setCurrentSpace(space.did())

    const file = new File([content], 'article.txt', { type: 'text/plain' })

    const cid = await client.uploadFile(file)
    console.log('✅ Uploaded to IPFS with CID:', cid.toString())

    return cid.toString()
}
