import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { stripHtml } from '@/lib/utils';

export async function POST(request: NextRequest) {
    const { article, question, mode = 'ask' } = await request.json();

    if (!article || !question) {
        return NextResponse.json({ answer: 'Invalid input.' }, { status: 400 });
    }

    const plainArticle = stripHtml(article);

    console.log('Request payload being sent:', {
        article: plainArticle,
        question,
        mode,
    });

    try {
        const systemPrompt = mode === 'rewrite'
            ? `
                You are a professional content rewriting assistant.
                Your task:
                - Rewrite the given article to make it fully SAFE, avoiding any sensitive, offensive, or controversial content.
                - Maintain the original meaning as much as possible but rephrase it into neutral, positive, and professional tone.
                - DO NOT explain anything, only output the rewritten article text itself.
              `.trim()
            : `
                You are a knowledgeable AI assistant.
                - Read the article carefully.
                - When answering, rely strictly on the article content.
                - If the article lacks enough information, attempt to answer meaningfully or politely say it's insufficient.
                - DO NOT invent any facts.
                - Keep responses professional, concise, and clear.
              `.trim();

        const response = await axios.post(
            process.env.TOGETHER_API_URL!,
            {
                model: 'mistralai/Mistral-7B-Instruct-v0.2',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Article:\n\n${plainArticle}\n\nQuestion:\n${question}` },
                ],
                temperature: 0.2,
                stream: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const answer = response.data.choices?.[0]?.message?.content?.trim() || '';

        if (!answer) {
            console.error('Together API returned unexpected structure:', JSON.stringify(response.data, null, 2));
            return NextResponse.json({ answer: 'Sorry, no valid response received from AI.' });
        }

        return NextResponse.json({ answer });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
        } else {
            console.error('Unknown error:', error);
        }
        return NextResponse.json({ answer: 'Something went wrong. Please try again later.' }, { status: 500 });
    }
}
