import { useEffect, useState } from 'react';
import { useLearner } from '../../context/LearnerContext';
import { useGPT } from '../../hooks/useGPT';
import { getSummaryPrompt } from '../../utils/prompts';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { submitLearningData } from '../../services/submissionService';
import { uploadBase64Image } from '../../utils/storage';

export function Step7_Summary() {
  const { state, dispatch } = useLearner();
  const { fetchGPT, loading, error } = useGPT();
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!state.summaryData && !loading) {
      generateSummary();
    }
  }, []);

  // 박수 효과음 재생
  useEffect(() => {
    if (state.summaryData) {
      const sfx = new Audio('/audio/sfx_applause.ogg');
      sfx.volume = 0.5;
      sfx.play().catch(e => console.warn('Applause SFX play failed:', e));
    }
  }, [state.summaryData]);

  const generateSummary = async () => {
    if (!state.learner || !state.level || !state.topic || !state.scenarioData) return;

    const actualTopic = state.topic === '직접 입력' ? state.customTopic : state.topic;
    let roundsHistory = state.rounds.map(r => 
      `Round ${r.round} — 질문: ${r.questionText} / 선택: ${r.options[r.selectedIndex!].text} / 피드백: ${r.feedback}`
    ).join('\n');

    const prompt = getSummaryPrompt(state.learner, state.level, actualTopic, state.scenarioData.scenario, roundsHistory);

    const result = await fetchGPT({
      systemPrompt: '당신은 PBL 교육 결과를 정리하는 전문 교육자입니다.\n학습자의 전체 학습 과정을 바탕으로 결론을 정리하세요.\n반드시 다음 JSON 스키마 형식으로만 응답하세요.',
      userPrompt: prompt,
      jsonMode: true,
    });

    if (result && result.summary) {
      dispatch({ type: 'SET_SUMMARY', payload: result });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // 1. Storage에 Base64 이미지 업로드 후 URL로 교체 (Firestore 1MB 용량 제한 해결)
      let finalState = { ...state };
      
      if (finalState.characterImageUrl && finalState.characterImageUrl.startsWith('data:image')) {
        const path = `characters/${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
        finalState.characterImageUrl = await uploadBase64Image(finalState.characterImageUrl, path);
      }

      const newRounds = await Promise.all(finalState.rounds.map(async (r) => {
        if (r.actionImageUrl && r.actionImageUrl.startsWith('data:image')) {
          const path = `actions/${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
          const url = await uploadBase64Image(r.actionImageUrl, path);
          return { ...r, actionImageUrl: url };
        }
        return r;
      }));
      finalState.rounds = newRounds;

      // 2. 최종 데이터 제출
      await submitLearningData(finalState);
      setIsCompleted(true);
    } catch (err) {
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !state.summaryData) {
    return <LoadingSpinner message="학습 여정을 되돌아보며 맞춤형 결론을 정리하고 있어요..." />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={generateSummary} className="bg-coral-400 text-white px-6 py-2 rounded-full">
          다시 시도
        </button>
      </div>
    );
  }

  const { summary, keyLearnings, practicalTips, encouragement } = state.summaryData;

  return (
    <div className="w-full max-w-4xl mx-auto pb-48 sm:pb-12 animate-fadeInUp">
      <h2 className="text-4xl font-bold text-center text-text-base mb-10 font-serif">🎉 학습 완료!</h2>

      <div className="bg-white rounded-3xl overflow-hidden shadow-soft mb-8">
        <div className="bg-sea-50 p-8 border-b-2 border-sea-100 text-center">
          <h3 className="text-2xl font-bold text-text-base leading-relaxed whitespace-pre-wrap">{encouragement}</h3>
        </div>
        
        <div className="p-8 space-y-10">
          <div>
            <h4 className="text-xl font-bold text-coral-600 mb-4 flex items-center">
              <span className="mr-2">📝</span> 학습 요약
            </h4>
            <p className="text-lg text-text-base leading-relaxed whitespace-pre-wrap bg-sand-100 p-6 rounded-2xl">
              {summary}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-sea-50 p-6 rounded-2xl">
              <h4 className="text-xl font-bold text-sea-600 mb-4 flex items-center">
                <span className="mr-2">✅</span> 핵심 배움
              </h4>
              <ul className="space-y-3">
                {keyLearnings.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-sea-400 mr-2 font-bold">✓</span>
                    <span className="text-text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-coral-50 p-6 rounded-2xl">
              <h4 className="text-xl font-bold text-coral-600 mb-4 flex items-center">
                <span className="mr-2">💡</span> 실무 적용 팁
              </h4>
              <ul className="space-y-3">
                {practicalTips.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-coral-400 mr-2 font-bold">✓</span>
                    <span className="text-text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed sm:relative bottom-0 left-0 w-full sm:w-auto p-4 sm:p-0 bg-white/95 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border-t-2 sm:border-0 border-sea-100 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 z-40 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] sm:shadow-none animate-fadeInUp">
        {!isCompleted ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:flex-1 sm:max-w-xs bg-coral-400 text-white text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-coral-600 transition-all shadow-md hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '제출 중...' : '📤 제출하기'}
          </button>
        ) : (
          <div className="w-full sm:flex-1 sm:max-w-xs bg-green-500 text-white text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-center shadow-md">
            ✅ 제출 완료
          </div>
        )}
        <button
          onClick={() => dispatch({ type: 'RESET_FROM_STEP_4' })}
          className="w-full sm:flex-1 sm:max-w-xs bg-white text-sea-600 border-2 border-sea-400 text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-sea-50 transition-all shadow-md"
        >
          🔄 다시 학습하기
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET_ALL' })}
          className="w-full sm:flex-1 sm:max-w-xs bg-gray-100 text-gray-600 border-2 border-gray-300 text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-gray-200 transition-all shadow-md"
        >
          🏠 처음으로
        </button>
      </div>

      {isCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center animate-fadeInUp">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-4">제출이 완료되었습니다!</h3>
            <p className="text-text-muted mb-8">수고하셨습니다. 선생님이 결과를 확인할 수 있습니다.</p>
            <button
              onClick={() => setIsCompleted(false)}
              className="w-full bg-coral-400 text-white font-bold py-3 rounded-full hover:bg-coral-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
