import { useState } from 'react';

export function useDalle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCharacterImage = async (ageGroup: string, gender: string, stage: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    // 귀여운 게임 캐릭터 생성을 위한 프롬프트
    const prompt = `A very cute, beautiful, and high-quality 2D anime chibi-style character portrait of a ${ageGroup} ${gender} who is a ${stage} in the seafood business. The character should look adorable, friendly, and wearing cute modern casual attire. Bright, pastel colors, clean transparent or very simple solid color background. Masterpiece, highly detailed, cute RPG game character art style.`;

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
      const isLocal = import.meta.env.DEV;

      let response: Response;
      let data: any;

      if (isLocal && apiKey) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120초 타임아웃

        response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-image-2',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
          }),
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          let errText = await response.text().catch(() => '');
          let errData: any = {};
          try { errData = JSON.parse(errText); } catch(e) {}
          throw new Error(errData?.error?.message || errText || 'OpenAI API 직접 호출에 실패했습니다.');
        }

        const rawData = await response.json();
        const imgData = rawData.data[0];
        data = { url: imgData.url || (imgData.b64_json ? `data:image/png;base64,${imgData.b64_json}` : null) };
      } else {
        response = await fetch('/api/generateImage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          const errText = await response.text();
          let errData = {};
          try { errData = JSON.parse(errText); } catch(e) {}
          throw new Error((errData as any).error || `이미지 생성 API 호출 실패 (${response.status})`);
        }

        const resText = await response.text();
        if (!resText) throw new Error('응답이 비어있습니다.');
        data = JSON.parse(resText);
      }

      return data.url;
    } catch (err: any) {
      console.error(err);
      if (err.name === 'AbortError') {
        setError('이미지 생성 서버 응답이 너무 오래 걸려 취소되었습니다. (타임아웃)');
      } else {
        setError(err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateActionImage = async (ageGroup: string, gender: string, stage: string, actionDesc: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    // 행동 이미지를 위한 프롬프트
    const prompt = `A very cute, beautiful, and high-quality 2D anime chibi-style character portrait of a ${ageGroup} ${gender} who is a ${stage} in the seafood business. The character is currently doing this action: "${actionDesc}". The character should look adorable, friendly, and wearing cute modern casual attire. Bright, pastel colors, clean transparent or very simple solid color background. Masterpiece, highly detailed, cute RPG game character art style.`;

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
      const isLocal = import.meta.env.DEV;

      let response: Response;
      let data: any;

      if (isLocal && apiKey) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120초 타임아웃

        response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-image-2',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
          }),
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          let errText = await response.text().catch(() => '');
          let errData: any = {};
          try { errData = JSON.parse(errText); } catch(e) {}
          throw new Error(errData?.error?.message || errText || 'OpenAI API 직접 호출에 실패했습니다.');
        }

        const rawData = await response.json();
        const imgData = rawData.data[0];
        data = { url: imgData.url || (imgData.b64_json ? `data:image/png;base64,${imgData.b64_json}` : null) };
      } else {
        response = await fetch('/api/generateImage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          const errText = await response.text();
          let errData = {};
          try { errData = JSON.parse(errText); } catch(e) {}
          throw new Error((errData as any).error || `이미지 생성 API 호출 실패 (${response.status})`);
        }

        const resText = await response.text();
        if (!resText) throw new Error('응답이 비어있습니다.');
        data = JSON.parse(resText);
      }

      return data.url;
    } catch (err: any) {
      console.error(err);
      if (err.name === 'AbortError') {
        setError('이미지 생성 서버 응답이 너무 오래 걸려 취소되었습니다. (타임아웃)');
      } else {
        setError(err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateCharacterImage, generateActionImage, loading, error };
}
