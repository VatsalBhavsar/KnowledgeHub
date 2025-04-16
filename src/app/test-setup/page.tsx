'use client'
import { create } from '@web3-storage/w3up-client'
import { useEffect } from 'react'

export default function TestSetup() {
    useEffect(() => {
        (async () => {
            try {
                const client = await create()
                console.log('Client created')

                const account = await client.login('artinsubject@gmail.com')
                console.log('Email verification initiated. Please check your inbox.')

                const space = await client.createSpace('KnowledgeHub', { account })
                await client.setCurrentSpace(space.did())
                console.log('🚀 DID:', space.did())
            } catch (error) {
                console.error('❌ Error during setup:', error)
            }
        })()
    }, [])

    return <p>Check the console for setup progress. Ensure you've verified your email.</p>
}
