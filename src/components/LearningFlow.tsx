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

export function LearningFlow() {
  const { state } = useLearner();

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
      <BubbleBackground />
      
      <header className="w-full bg-white bg-opacity-80 backdrop-blur-md sticky top-0 z-10 border-b-2 border-sea-100 mb-8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌊</span>
            <h1 className="text-2xl font-bold font-serif text-sea-600">수산식품 PBL 아카데미</h1>
          </div>
          <div className="text-sm font-bold text-text-muted bg-sea-50 px-4 py-2 rounded-full">
            {state.learner ? `${state.learner.name}님 학습 중` : '학습 준비'}
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
