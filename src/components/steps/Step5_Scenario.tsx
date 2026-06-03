import { useEffect } from 'react';
import { useLearner } from '../../context/LearnerContext';
import { useGPT } from '../../hooks/useGPT';
import { getScenarioPrompt } from '../../utils/prompts';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function Step5_Scenario() {
  const { state, dispatch } = useLearner();
  const { fetchGPT, loading, error } = useGPT();

  useEffect(() => {
    if (!state.scenarioData && state.learner && state.level && state.topic && !loading) {
      generateScenario();
    }
  }, []);

  const generateScenario = async () => {
    if (!state.learner || !state.level || !state.topic) return;
    
    const actualTopic = state.topic === '직접 입력' ? state.customTopic : state.topic;
    const prompt = getScenarioPrompt(state.learner, state.level, actualTopic);
    
    const result = await fetchGPT({
      systemPrompt: '당신은 수산식품 가공 분야 PBL 교육 전문가입니다.\n학습자 정보와 주제를 바탕으로 현실 기반 PBL 문제 시나리오를 작성하세요.\n반드시 다음 JSON 스키마 형식으로만 응답하세요.',
      userPrompt: prompt,
      jsonMode: true,
    });

    if (result && result.scenario) {
      dispatch({ type: 'SET_SCENARIO', payload: result });
    }
  };

  if (loading || !state.scenarioData) {
    return <LoadingSpinner message="현실 기반의 생생한 문제 시나리오를 구성하고 있어요..." />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={generateScenario} className="bg-coral-400 text-white px-6 py-2 rounded-full">
          다시 시도
        </button>
      </div>
    );
  }

  const { scenario, problemStatement, context } = state.scenarioData;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="bg-white rounded-3xl overflow-hidden shadow-soft">
        <div className="bg-sea-600 p-8 text-white">
          <h2 className="text-3xl font-bold font-serif mb-2">오늘의 미션</h2>
          <p className="opacity-80">주어진 상황을 읽고 문제를 해결해 보세요.</p>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="prose prose-lg max-w-none text-text-base leading-relaxed whitespace-pre-wrap">
            {scenario}
          </div>

          <div className="bg-sand-100 border-l-4 border-coral-400 p-6 rounded-r-2xl">
            <h4 className="font-bold text-coral-600 mb-2 flex items-center">
              <span className="mr-2">🎯</span> 핵심 문제
            </h4>
            <p className="text-lg font-bold text-text-base">{problemStatement}</p>
          </div>

          <div>
            <h4 className="font-bold text-text-muted mb-3">배경 정보</h4>
            <div className="flex flex-wrap gap-2">
              {context.map((ctx, idx) => (
                <span key={idx} className="bg-sea-50 text-sea-600 px-4 py-2 rounded-full text-sm font-bold border border-sea-200">
                  {ctx}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 6 })}
          className="bg-coral-400 text-white text-xl font-bold py-4 px-16 rounded-full hover:bg-coral-600 transition-all shadow-md hover:-translate-y-1"
        >
          문제 해결 시작하기
        </button>
      </div>
    </div>
  );
}
