import { useEffect, useState } from 'react';
import { useLearner } from '../../context/LearnerContext';
import { useGPT } from '../../hooks/useGPT';
import { getPreTestPrompt } from '../../utils/prompts';
import { ProgressBar } from '../ui/ProgressBar';
import { OptionCard } from '../ui/OptionCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function Step2_PreTest() {
  const { state, dispatch } = useLearner();
  const { fetchGPT, loading, error } = useGPT();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (state.preTestQuestions.length === 0 && state.learner && !loading) {
      generateQuestions();
    }
  }, [state.learner]);

  const generateQuestions = async () => {
    if (!state.learner) return;
    const prompt = getPreTestPrompt(state.learner);
    const result = await fetchGPT({
      systemPrompt: '당신은 수산식품 가공업체 교육 전문가입니다.\n학습자 정보를 바탕으로 사전지식 테스트 5문항을 생성하세요.\n반드시 다음 JSON 스키마 형식으로만 응답하세요.',
      userPrompt: prompt,
      jsonMode: true,
    });

    if (result && result.questions) {
      dispatch({ type: 'SET_PRE_TEST_QUESTIONS', payload: result.questions });
    }
  };

  const handleSelect = (optionIndex: number) => {
    dispatch({
      type: 'SET_PRE_TEST_ANSWER',
      payload: { index: currentIndex, answerIndex: optionIndex },
    });

    if (currentIndex < 4) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 400);
    } else {
      setTimeout(() => {
        dispatch({ type: 'SET_STEP', payload: 3 });
      }, 400);
    }
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={generateQuestions} className="bg-coral-400 text-white px-6 py-2 rounded-full">
          다시 시도
        </button>
      </div>
    );
  }

  if (loading || state.preTestQuestions.length === 0) {
    return <LoadingSpinner message="학습자님을 위한 맞춤형 진단 테스트를 만들고 있어요..." />;
  }

  const currentQuestion = state.preTestQuestions[currentIndex];
  const selectedAnswer = state.preTestAnswers[currentIndex];
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeInUp">
      <div className="mb-8">
        <ProgressBar current={currentIndex + 1} total={5} />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-soft">
        <h3 className="text-2xl font-bold text-text-base mb-8 leading-snug">
          <span className="text-coral-400 mr-2">Q{currentIndex + 1}.</span>
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => (
            <OptionCard
              key={idx}
              label={labels[idx]}
              text={option}
              selected={selectedAnswer === idx}
              onClick={() => handleSelect(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
