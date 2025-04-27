import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { stripHtml } from '@/lib/utils';

export async function POST(request: NextRequest) {
    const { article } = await request.json();

    if (!article) {
        return NextResponse.json({ riskLevel: 'Unknown' }, { status: 400 });
    }

    const plainArticle = stripHtml(article);

    try {
        const response = await axios.post(
            process.env.TOGETHER_API_URL!,
            {
                model: 'mistralai/Mistral-7B-Instruct-v0.2', // ✅ free model
                messages: [
                    {
                        role: 'system',
                        content: `
                            You are a content risk analysis expert.
                            Your task is to strictly classify an article into one of the following four labels:
                            - "Safe"
                            - "Sensitive"
                            - "Offensive"
                            - "Unknown"

                            Instructions:
                            - Analyze the article carefully.
                            - Choose ONLY one label from the above list.
                            - DO NOT provide explanations, summaries, or any extra text.
                            - Just return the exact one-word label.

                            Example Format:
                            Safe
                        `.trim(),
                    },
                    {
                        role: 'user',
                        content: `Article:\n\n${plainArticle}`,
                    },
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

        const riskLevel = response.data.choices?.[0]?.message?.content?.trim() || 'Unknown';

        return NextResponse.json({ riskLevel });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
        } else {
            console.error('Unknown error:', error);
        }
        return NextResponse.json({ riskLevel: 'Unknown' }, { status: 500 });
    }
}