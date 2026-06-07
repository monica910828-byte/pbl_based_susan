import { useState } from 'react';
import { useLearner } from '../../context/LearnerContext';
import type {  AgeGroup, StartupStage, Gender  } from '../../types';
import clsx from 'clsx';

const ageGroups: AgeGroup[] = ['20대', '30대', '40대', '50대', '60대', '70대', '80대 이상'];
const startupStages: StartupStage[] = ['예비창업자', '실무자', '관리자', '대표자'];
const genders: Gender[] = ['남성', '여성', '선택안함'];

export function Step1_LearnerInfo() {
  const { state, dispatch } = useLearner();
  const [name, setName] = useState(state.learner?.name || '');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(state.learner?.ageGroup || null);
  const [stage, setStage] = useState<StartupStage | null>(state.learner?.stage || null);
  const [gender, setGender] = useState<Gender | null>(state.learner?.gender || null);

  const isValid = name.trim() !== '' && ageGroup !== null && stage !== null && gender !== null;

  const handleNext = () => {
    if (isValid) {
      dispatch({
        type: 'SET_LEARNER_INFO',
        payload: { name: name.trim(), ageGroup, stage, gender },
      });
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeInUp">
      <div className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-xl border border-sea-100 relative">
        <div className="bg-sea-50 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl shadow-inner text-sea-500">
          🐟
        </div>
        <h1 className="text-4xl font-extrabold text-sea-700 tracking-tight mb-2">수산식품 PBL 아카데미</h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto break-keep leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
          * 수산식품 PBL아카데미는 학습자의 성함(닉네임), 성별, 연령대, 창업단계, 학습 수준 및 결과를 수집합니다. 수집한 정보는 학습을 위해서만 사용되며 학습목적 달성 후 완전히 폐기됩니다.
        </p>
      </div>
      
      <div className="bg-white rounded-3xl p-8 shadow-soft space-y-8 mt-8">
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
          <label className="block text-lg font-bold text-text-base mb-3">성별</label>
          <div className="flex flex-wrap gap-3">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={clsx(
                  'px-6 py-3 rounded-full font-bold transition-all',
                  gender === g
                    ? 'bg-coral-400 text-white shadow-md transform -translate-y-0.5'
                    : 'bg-sea-50 text-text-muted hover:bg-sea-100'
                )}
              >
                {g}
              </button>
            ))}
          </div>
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
