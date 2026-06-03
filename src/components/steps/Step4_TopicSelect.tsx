import { useState } from 'react';
import { useLearner } from '../../context/LearnerContext';
import type {  Topic  } from '../../types';
import clsx from 'clsx';

const topics: { id: Topic; icon: string; desc: string }[] = [
  { id: '마케팅', icon: '📣', desc: '판로 개척, 브랜딩, SNS 마케팅 등' },
  { id: '수산물 가공 기술', icon: '🐟', desc: '원료 선별, 가공 공정, 품질 관리 등' },
  { id: '세무 및 정산', icon: '📊', desc: '매출·매입 관리, 부가세, 사업자 신고 등' },
  { id: '직접 입력', icon: '✏️', desc: '원하시는 주제를 직접 입력해주세요' },
];

export function Step4_TopicSelect() {
  const { state, dispatch } = useLearner();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(state.topic);
  const [customInput, setCustomInput] = useState(state.customTopic);

  const handleNext = () => {
    if (selectedTopic) {
      dispatch({
        type: 'SET_TOPIC',
        payload: { topic: selectedTopic, customTopic: customInput },
      });
      dispatch({ type: 'SET_STEP', payload: 5 });
    }
  };

  const isValid = selectedTopic && (selectedTopic !== '직접 입력' || customInput.trim().length > 0);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-3xl font-bold text-center text-text-base mb-8 font-serif">학습하실 주제를 선택해주세요</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id)}
            className={clsx(
              'p-6 rounded-3xl border-2 text-left transition-all duration-300',
              selectedTopic === t.id
                ? 'bg-coral-100 border-coral-400 shadow-soft transform -translate-y-2'
                : 'bg-white border-transparent hover:bg-sea-50 hover:-translate-y-1'
            )}
          >
            <div className="text-4xl mb-4">{t.icon}</div>
            <h3 className="text-xl font-bold text-text-base mb-2">{t.id}</h3>
            <p className="text-text-muted">{t.desc}</p>
          </button>
        ))}
      </div>

      <div className={clsx(
        'transition-all duration-500 overflow-hidden',
        selectedTopic === '직접 입력' ? 'max-h-40 opacity-100 mb-8' : 'max-h-0 opacity-0'
      )}>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="예: 해조류를 활용한 밀키트 신제품 기획 방향"
          className="w-full p-4 bg-white border-2 border-sea-200 rounded-2xl focus:outline-none focus:border-coral-400 resize-none"
          rows={3}
          maxLength={200}
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={clsx(
            'py-4 px-16 rounded-full text-xl font-bold transition-all',
            isValid
              ? 'bg-coral-400 text-white hover:bg-coral-600 shadow-md hover:-translate-y-1'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          시나리오 생성하기
        </button>
      </div>
    </div>
  );
}
