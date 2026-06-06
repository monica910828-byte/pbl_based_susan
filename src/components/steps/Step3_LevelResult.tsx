import { useEffect } from 'react';
import { useLearner } from '../../context/LearnerContext';
import type {  Level  } from '../../types';

export function Step3_LevelResult() {
  const { state, dispatch } = useLearner();

  useEffect(() => {
    let correctCount = 0;
    state.preTestQuestions.forEach((q, idx) => {
      if (state.preTestAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    let assignedLevel: Level = '초급';
    if (correctCount >= 3) assignedLevel = '고급';
    else if (correctCount === 2) assignedLevel = '중급';

    dispatch({ type: 'SET_LEVEL', payload: assignedLevel });
  }, [state.preTestQuestions, state.preTestAnswers, dispatch]);

  const levelInfo = {
    초급: { icon: '🐚', message: '기초부터 탄탄히 다져봐요!' },
    중급: { icon: '🐠', message: '실무 적용 중심으로 심화해 봅시다!' },
    고급: { icon: '🦞', message: '전문가 수준의 심층 분석으로 나아갑니다!' },
  };

  const currentLevelInfo = levelInfo[state.level || '초급'];

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeInUp">
      <div className="bg-lavender-100 rounded-3xl p-10 text-center shadow-soft">
        <div className="text-7xl mb-4 animate-float">{currentLevelInfo.icon}</div>
        <h2 className="text-3xl font-bold text-text-base mb-2">
          테스트 결과: <span className="text-lavender-400">{state.level}</span> 단계
        </h2>
        <p className="text-xl text-text-muted mb-8">{currentLevelInfo.message}</p>
        
        <div className="bg-white rounded-2xl p-6 mb-8 text-left max-h-64 overflow-y-auto">
          <h4 className="font-bold text-lg mb-4 text-text-base">오답 노트 및 해설</h4>
          <div className="space-y-4">
            {state.preTestQuestions.map((q, idx) => {
              const isCorrect = state.preTestAnswers[idx] === q.correctIndex;
              return (
                <div key={idx} className={`p-4 rounded-xl ${isCorrect ? 'bg-sea-50' : 'bg-coral-50'}`}>
                  <p className="font-bold mb-2">Q{idx + 1}. {q.question}</p>
                  <p className="text-sm">나의 선택: {q.options[state.preTestAnswers[idx]] || '미선택'}</p>
                  {!isCorrect && (
                    <p className="text-sm text-coral-600 mt-1">정답: {q.options[q.correctIndex]}</p>
                  )}
                  <p className="text-sm mt-2 text-text-muted">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}
          className="bg-coral-400 text-white text-xl font-bold py-4 px-12 rounded-full hover:bg-coral-600 transition-all shadow-md hover:-translate-y-1"
        >
          학습 시작하기
        </button>
      </div>
    </div>
  );
}
