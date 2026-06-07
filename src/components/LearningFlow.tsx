import { useLearner } from '../context/LearnerContext';
import { BubbleBackground } from './ui/BubbleBackground';
import { SeaweedDivider } from './ui/SeaweedDivider';
import { Step1_LearnerInfo } from './steps/Step1_LearnerInfo';
import { Step2_PreTest } from './steps/Step2_PreTest';
import { Step3_LevelResult } from './steps/Step3_LevelResult';
import { Step4_TopicSelect } from './steps/Step4_TopicSelect';
import { Step5_Scenario } from './steps/Step5_Scenario';
import { Step6_QuizRounds } from './steps/Step6_QuizRounds';
import { Step7_Summary } from './steps/Step7_Summary';

import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

import { AudioPlayer } from './ui/AudioPlayer';

export function LearningFlow() {
  const { state, dispatch } = useLearner();

  const renderStep = () => {
    switch (state.step) {
      case 1: return <Step1_LearnerInfo />;
      case 2: return <Step2_PreTest />;
      case 3: return <Step3_LevelResult />;
      case 4: return <Step4_TopicSelect />;
      case 5: return <Step5_Scenario />;
      case 6: return <Step6_QuizRounds />;
      case 7: return <Step7_Summary />;
      default: return <Step1_LearnerInfo />;
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      <AudioPlayer />
      <BubbleBackground />
      
      <header className="w-full bg-white bg-opacity-80 backdrop-blur-md sticky top-0 z-10 border-b-2 border-sea-100 mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 min-h-[4rem] py-2 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <button 
            onClick={() => {
              if (state.step > 1) {
                if (window.confirm('처음으로 돌아가시겠습니까? 진행 중인 학습 내용이 초기화됩니다.')) {
                  dispatch({ type: 'RESET_ALL' });
                }
              } else {
                dispatch({ type: 'RESET_ALL' });
              }
            }}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity text-left cursor-pointer"
            title="처음으로 돌아가기"
          >
            <span className="text-2xl sm:text-3xl text-sea-500">🐟</span>
            <h1 className="text-lg sm:text-2xl font-bold text-sea-600">수산식품 PBL 아카데미</h1>
          </button>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-xs sm:text-sm font-bold text-text-muted bg-sea-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full max-w-[150px] sm:max-w-none truncate">
              {state.learner ? `${state.learner.name}님 학습 중` : '학습 준비'}
            </div>
            <Link 
              to="/admin" 
              className="flex items-center space-x-1 text-xs sm:text-sm bg-coral-50 hover:bg-coral-100 text-coral-600 px-3 py-1.5 sm:py-2 rounded-full font-bold transition-colors"
              title="교사 모드 접속"
            >
              <GraduationCap size={16} />
              <span className="hidden sm:inline">교사 모드</span>
            </Link>
          </div>
        </div>
        <div className="w-full h-1 bg-sea-200">
          <div 
            className="h-full bg-coral-400 transition-all duration-500 ease-out" 
            style={{ width: `${(state.step / 7) * 100}%` }} 
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {renderStep()}
        {state.step > 1 && state.step < 7 && <SeaweedDivider />}
      </main>
    </div>
  );
}
