import { useEffect, useState } from 'react';
import { useLearner } from '../../context/LearnerContext';
import { useGPT } from '../../hooks/useGPT';
import { getRoundPrompt } from '../../utils/prompts';
import { ProgressBar } from '../ui/ProgressBar';
import { OptionCard } from '../ui/OptionCard';
import { FeedbackBox } from '../ui/FeedbackBox';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function Step6_QuizRounds() {
  const { state, dispatch } = useLearner();
  const { fetchGPT, loading, error } = useGPT();
  
  const currentRoundIndex = state.rounds.length;
  const isComplete = currentRoundIndex === 3;
  const currentRoundData = state.rounds[currentRoundIndex - 1]; // for displaying feedback after selection
  
  // Local state for the *next* question being fetched or displayed before selection
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!isComplete && !showFeedback && !loading && !activeQuestion) {
      generateRound();
    }
  }, [currentRoundIndex, showFeedback]);

  const generateRound = async () => {
    if (!state.scenarioData || !state.level || !state.learner) return;

    let previousRoundsHistory = '없음';
    if (state.rounds.length > 0) {
      previousRoundsHistory = state.rounds.map(r => 
        `라운드 ${r.round}: 질문(${r.questionText}), 선택(${r.options[r.selectedIndex!].text})`
      ).join('\n');
    }

    const prompt = getRoundPrompt(
      state.scenarioData.scenario,
      state.scenarioData.problemStatement,
      currentRoundIndex + 1,
      previousRoundsHistory,
      state.level,
      state.learner
    );

    const result = await fetchGPT({
      systemPrompt: '당신은 수산식품 가공 분야 PBL 교육 진행자입니다.\n학습자의 이전 선택을 반영하여 다음 질문을 생성하세요.\n반드시 다음 JSON 스키마 형식으로만 응답하세요.',
      userPrompt: prompt,
      jsonMode: true,
    });

    if (result && result.questionText) {
      setActiveQuestion({
        round: currentRoundIndex + 1,
        previousAnswerProsCons: result.previousAnswerProsCons,
        questionText: result.questionText,
        options: result.options,
        correctIndex: result.correctIndex,
        feedbackIfCorrect: result.feedbackIfCorrect,
        feedbackIfWrong: result.feedbackIfWrong,
        selectedIndex: null,
        feedback: '',
      });
    }
  };

  const handleSelect = (idx: number) => {
    if (!activeQuestion) return;

    const isCorrect = idx === activeQuestion.correctIndex;
    const feedback = isCorrect ? activeQuestion.feedbackIfCorrect : activeQuestion.feedbackIfWrong;
    
    const newRound = {
      ...activeQuestion,
      selectedIndex: idx,
      feedback,
    };

    dispatch({ type: 'SET_ROUNDS', payload: [...state.rounds, newRound] });
    setActiveQuestion(null);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentRoundIndex === 3) {
      dispatch({ type: 'SET_STEP', payload: 7 });
    }
  };

  if (isComplete && !showFeedback) {
    // Should not normally reach here without showFeedback being true for the last round,
    // but just in case, redirect to step 7
    dispatch({ type: 'SET_STEP', payload: 7 });
    return null;
  }

  if (error && !showFeedback) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={generateRound} className="bg-coral-400 text-white px-6 py-2 rounded-full">
          다시 시도
        </button>
      </div>
    );
  }

  if (loading || (!activeQuestion && !showFeedback)) {
    return <LoadingSpinner message={`라운드 ${currentRoundIndex + 1} 질문을 준비 중입니다...`} />;
  }

  const displayRoundNum = showFeedback ? currentRoundIndex : currentRoundIndex + 1;
  const displayData = showFeedback ? currentRoundData : activeQuestion;

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeInUp">
      <div className="mb-8">
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3].map(step => (
            <div key={step} className={`w-3 h-3 rounded-full ${step <= displayRoundNum ? 'bg-coral-400' : 'bg-sea-200'}`} />
          ))}
        </div>
        <ProgressBar current={displayRoundNum} total={3} />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-soft">
        <div className="inline-block bg-sea-100 text-sea-600 font-bold px-4 py-1 rounded-full mb-6">
          Round {displayRoundNum}
        </div>
        
        {displayData.previousAnswerProsCons && !showFeedback && (
          <div className="mb-6 p-5 bg-sea-50 border-l-4 border-sea-400 rounded-r-xl shadow-sm text-gray-800">
            <h4 className="font-bold text-sea-600 mb-2">이전 선택에 대한 분석</h4>
            <p className="leading-relaxed whitespace-pre-wrap">{displayData.previousAnswerProsCons}</p>
          </div>
        )}

        <h3 className="text-2xl font-bold text-text-base mb-8 leading-snug">
          {displayData.questionText}
        </h3>

        <div className="space-y-4 mb-6">
          {displayData.options.map((opt: any, idx: number) => (
            <OptionCard
              key={idx}
              label={opt.label}
              text={opt.text}
              selected={displayData.selectedIndex === idx}
              onClick={() => handleSelect(idx)}
              disabled={showFeedback}
            />
          ))}
        </div>

        {showFeedback && (
          <div className="animate-fadeInUp">
            <FeedbackBox
              title={displayData.selectedIndex === displayData.correctIndex ? '훌륭한 선택입니다!' : '이런 관점도 있어요'}
              content={displayData.feedback}
            />
            <div className="mt-8 text-right">
              <button
                onClick={handleNext}
                className="bg-coral-400 text-white text-lg font-bold py-3 px-8 rounded-full hover:bg-coral-600 transition-all shadow-md"
              >
                {displayRoundNum === 3 ? '결론 보기' : '다음 질문으로'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
