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
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('GPT API 요청에 실패했습니다.');
      }

      const data = await response.json();
      
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
