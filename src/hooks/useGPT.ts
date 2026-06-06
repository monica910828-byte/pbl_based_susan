import { useState } from 'react';

interface GPTRequest {
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
}

export function useGPT() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGPT = async (request: GPTRequest) => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
      const isLocal = import.meta.env.DEV;

      let response: Response;
      let data: any;

      if (isLocal && apiKey) {
        // 로컬 개발 환경에서는 직접 호출 (Vercel API 라우팅 회피)
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: request.systemPrompt },
              { role: 'user', content: request.userPrompt },
            ],
            response_format: request.jsonMode ? { type: 'json_object' } : { type: 'text' },
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          let errText = await response.text().catch(() => '');
          let errData: any = {};
          try { errData = JSON.parse(errText); } catch(e) {}
          throw new Error(errData?.error?.message || errText || 'OpenAI API 직접 호출에 실패했습니다.');
        }

        const rawData = await response.json();
        data = { content: rawData.choices[0].message.content };
      } else {
        // 배포 환경(Vercel)에서는 /api/gpt 서버리스 함수 사용
        response = await fetch('/api/gpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `GPT API(서버리스) 요청에 실패했습니다. (${response.status})`);
        }

        data = await response.json();
      }
      
      if (request.jsonMode) {
        return JSON.parse(data.content);
      }
      return data.content;
    } catch (err: any) {
      console.error(err);
      setError(err.message || '오류가 발생했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchGPT, loading, error };
}
