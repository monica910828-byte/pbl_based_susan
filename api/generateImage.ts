import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export const maxDuration = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.images.generate({
      model: 'gpt-image-1.5',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    const imgData = response.data[0];
    const url = imgData.url || (imgData.b64_json ? `data:image/png;base64,${imgData.b64_json}` : null);
    res.status(200).json({ url });
  } catch (error: any) {
    console.error('[DALL-E API Error]', error);
    res.status(500).json({ error: error.message ? `이미지 생성 오류: ${error.message}` : 'DALL-E API 호출 실패' });
  }
}
