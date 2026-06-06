import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export const maxDuration = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup if necessary, though Vercel handles standard routing if requested from same domain
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { systemPrompt, userPrompt, jsonMode = false } = req.body;

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    res.status(200).json({ content: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('[GPT API Error]', error);
    res.status(500).json({ error: error.message ? `API 오류: ${error.message}` : 'GPT API 호출 실패' });
  }
}
