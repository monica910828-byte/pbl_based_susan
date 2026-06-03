import { useState } from 'react';
import { useLearner } from '../../context/LearnerContext';
import type {  AgeGroup, StartupStage  } from '../../types';
import clsx from 'clsx';

const ageGroups: AgeGroup[] = ['20대', '30대', '40대', '50대', '60대', '70대', '80대 이상'];
const startupStages: StartupStage[] = ['예비창업자', '실무자', '관리자', '대표자'];

export function Step1_LearnerInfo() {
  const { state, dispatch } = useLearner();
  const [name, setName] = useState(state.learner?.name || '');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(state.learner?.ageGroup || null);
  const [stage, setStage] = useState<StartupStage | null>(state.learner?.stage || null);

  const isValid = name.trim() !== '' && ageGroup !== null && stage !== null;

  const handleNext = () => {
    if (isValid) {
      dispatch({
        type: 'SET_LEARNER_INFO',
        payload: { name: name.trim(), ageGroup, stage },
      });
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeInUp">
      <h2 className="text-3xl font-bold text-center text-text-base mb-8 font-serif">학습자 정보 입력</h2>
      
      <div className="bg-white rounded-3xl p-8 shadow-soft space-y-8">
        <div>
          <label className="block text-lg font-bold text-text-base mb-3">성함(또는 닉네임)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
            className="w-full p-4 bg-sea-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-sea-400 focus:bg-white transition-colors text-lg"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-text-base mb-3">연령대</label>
          <div className="flex flex-wrap gap-3">
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => setAgeGroup(age)}
                className={clsx(
                  'px-6 py-3 rounded-full font-bold transition-all',
                  ageGroup === age
                    ? 'bg-coral-400 text-white shadow-md transform -translate-y-0.5'
                    : 'bg-sea-50 text-text-muted hover:bg-sea-100'
                )}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-bold text-text-base mb-3">창업 및 직무 단계</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {startupStages.map((s) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={clsx(
                  'p-4 rounded-2xl font-bold transition-all text-center',
                  stage === s
                    ? 'bg-coral-400 text-white shadow-md transform -translate-y-0.5'
                    : 'bg-sea-50 text-text-muted hover:bg-sea-100'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={handleNext}
            disabled={!isValid}
            className={clsx(
              'w-full py-5 rounded-full text-xl font-bold transition-all',
              isValid
                ? 'bg-coral-400 text-white hover:bg-coral-600 shadow-md transform hover:-translate-y-1'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
}
