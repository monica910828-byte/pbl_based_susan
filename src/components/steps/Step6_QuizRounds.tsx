import { useEffect, useState, useRef } from 'react';
import { useLearner } from '../../context/LearnerContext';
import { useGPT } from '../../hooks/useGPT';
import { getRoundPrompt } from '../../utils/prompts';
import { ProgressBar } from '../ui/ProgressBar';
import { Typewriter } from '../ui/Typewriter';

export function Step6_QuizRounds() {
  const { state, dispatch } = useLearner();
  const { fetchGPT, loading: gptLoading, error: gptError } = useGPT();
  
  const currentRoundIndex = state.rounds.length;
  const isComplete = currentRoundIndex === 3;
  const currentRoundData = state.rounds[currentRoundIndex - 1];
  
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [showEndingScene, setShowEndingScene] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  // 진행 상태 락(Lock) 변수 (중복 호출 방지)
  const isFetchingRef = useRef(false);

  // 정적 캐릭터 URL 설정
  const characterImageUrl = state.learner?.gender === '남성' 
    ? '/images/char_male.png' 
    : state.learner?.gender === '선택안함'
    ? '/images/char_cat.png'
    : '/images/char_female.png';

  // 캐릭터 이미지 Context에 설정 (제출 시 저장용)
  useEffect(() => {
    if (state.characterImageUrl !== characterImageUrl && !isComplete) {
      dispatch({ type: 'SET_CHARACTER_IMAGE', payload: characterImageUrl });
    }
  }, [characterImageUrl, isComplete, state.characterImageUrl]);

  // 라운드 데이터 생성 Effect
  useEffect(() => {
    if (!isComplete && !showFeedback && !activeQuestion && !gptLoading && !isFetchingRef.current && !showEndingScene) {
      generateRound();
    }
  }, [isComplete, showFeedback, activeQuestion, gptLoading, showEndingScene]);

  const generateRound = async () => {
    if (!state.scenarioData || !state.level || !state.learner || isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setTypewriterDone(false);

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
      systemPrompt: '당신은 수산식품 가공 분야 PBL 교육 진행자입니다. 학습자의 이전 선택을 반영하여 다음 시나리오 진행을 위한 대화 지문을 생성하세요. JSON 스키마 형식으로 응답하세요.',
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
    isFetchingRef.current = false;
  };

  const handleSelect = (idx: number) => {
    if (!activeQuestion || !typewriterDone || isMoving) return;

    setIsMoving(true);
    
    // 이동 효과음 재생
    const sfx = new Audio('/audio/sfx_move.mp3');
    sfx.volume = 0.4;
    sfx.play().catch(e => console.warn('SFX play failed:', e));

    const isCorrect = idx === activeQuestion.correctIndex;
    const feedback = isCorrect ? activeQuestion.feedbackIfCorrect : activeQuestion.feedbackIfWrong;
    
    // 글로벌 상태 즉시 업데이트 (이로 인해 캐릭터가 다음 거점으로 이동을 시작함)
    const newRound = {
      ...activeQuestion,
      selectedIndex: idx,
      feedback,
    };

    dispatch({ type: 'SET_ROUNDS', payload: [...state.rounds, newRound] });
    setActiveQuestion(null);

    // 캐릭터가 1.2초간 이동하는 모습을 보여준 뒤 피드백 창을 띄움
    setTimeout(() => {
      setIsMoving(false);
      setShowFeedback(true);
    }, 1200);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentRoundIndex === 3) {
      setShowEndingScene(true);
    }
  };

  // 엔딩 씬 렌더링
  if (showEndingScene) {
    return (
      <div className="w-full max-w-5xl mx-auto animate-fadeInUp">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-sea-200 flex flex-col items-center justify-center bg-sea-50" style={{ aspectRatio: '16/10' }}>
           <div className="z-10 bg-white/95 p-10 rounded-3xl text-center shadow-2xl max-w-lg border-4 border-amber-300 relative">
              <div className="text-6xl mb-4">🎊🦀</div>
              <h2 className="text-4xl font-extrabold text-sea-600 mb-6">여정 완료!</h2>
              <p className="text-2xl font-bold text-gray-800 leading-relaxed mb-6">모든 문제를 훌륭히 해결했어요!</p>
              
              {/* 캐릭터와 어업인이 만나는 합성 이미지 */}
              <div className="flex items-end justify-center mb-6 space-x-4">
                <img src={characterImageUrl} alt="My Character" className="h-40 w-auto object-contain drop-shadow-md" />
                <img src="/images/fisherperson.png" alt="Fisherperson" className="h-48 w-auto object-contain drop-shadow-md" />
              </div>

              <button 
                onClick={() => dispatch({ type: 'SET_STEP', payload: 7 })}
                className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-extrabold py-4 px-10 rounded-full text-2xl shadow-[0_6px_0_rgb(180,83,9)] transition-transform transform hover:translate-y-1 active:shadow-none animate-pulse"
              >
                최종 결과 확인하기 🚀
              </button>
           </div>
        </div>
      </div>
    );
  }

  // 에러 발생 시 UI
  if (gptError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-900 rounded-2xl border-4 border-red-900 p-8 text-center animate-fadeInUp">
        <div className="text-6xl mb-4">⚔️</div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">퀘스트 오류 발생</h2>
        <p className="text-gray-300 mb-8 max-w-md break-keep">{gptError}</p>
        <button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full transition-all">
          다시 접속하기
        </button>
      </div>
    );
  }

  const displayRoundNum = Math.min(state.rounds.length + 1, 3);
  const displayData = showFeedback ? currentRoundData : activeQuestion;

  // RPG 맵 거점 노드 위치
  const nodes = [
    { left: '20%', top: '55%' }, // 1번 퀘스트 위치
    { left: '50%', top: '45%' }, // 2번 퀘스트 위치
    { left: '80%', top: '55%' }, // 3번 퀘스트 위치
  ];
  const currentPos = nodes[displayRoundNum - 1] || nodes[0];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeInUp">
      <div className="mb-4 px-4">
        <div className="flex justify-center space-x-2 mb-3">
          {[1, 2, 3].map(step => (
            <div key={step} className={`w-3 h-3 rounded-full ${step <= displayRoundNum ? 'bg-amber-400' : 'bg-gray-300'}`} />
          ))}
        </div>
        <ProgressBar current={displayRoundNum} total={3} />
      </div>

      {/* 2.5D RPG 여정 맵 컨테이너 (모바일에서 대화창이 잘리지 않도록 min-h 지정, aspect ratio 제거하여 높이 유동성 확보) */}
      <div 
        className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-sea-200 flex flex-col bg-cover bg-top min-h-[750px] md:min-h-[700px]" 
        style={{ backgroundImage: 'url(/images/map_bg.png)' }}
      >
        
        {/* 거점 마커 표시 */}
        {nodes.map((node, i) => (
          <div 
            key={i}
            className={`absolute z-10 w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center font-bold border-2 ${
              i + 1 < displayRoundNum ? 'bg-green-400 border-white text-white' : 
              i + 1 === displayRoundNum ? 'bg-amber-400 border-white text-white animate-pulse' : 
              'bg-gray-200/80 border-gray-400 text-gray-500'
            }`}
            style={{ left: node.left, top: node.top }}
          >
            {i + 1 < displayRoundNum ? '✓' : i + 1}
          </div>
        ))}

        {/* 캐릭터 이동 위치 시뮬레이션 */}
        {characterImageUrl && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[1200ms] ease-in-out z-20 drop-shadow-2xl"
            style={{ left: currentPos.left, top: currentPos.top }}
          >
            <img src={characterImageUrl} alt="My Character" className={`h-24 sm:h-32 md:h-40 w-auto object-contain ${isMoving ? 'animate-bounce' : 'animate-pulse'}`} />
          </div>
        )}

        {/* 하단 귀여운 대화창 영역 (절대위치가 아닌 문서 흐름에 두어 높이 자동 확장) */}
        {displayData && (
          <div className="mt-auto w-full z-40 p-3 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-24 sm:pt-32 relative">
            
            {/* 이전 선택 상황 피드백(퀘스트 업데이트 느낌) */}
            {displayData.previousAnswerProsCons && !showFeedback && (
               <div className="mb-4 bg-white/95 border-2 border-sea-300 rounded-2xl p-4 sm:p-5 text-sea-900 text-lg sm:text-xl backdrop-blur-md shadow-sm mx-2 sm:mx-4 whitespace-pre-wrap break-words">
                 <span className="font-extrabold text-sea-600 mr-2">📌 이전 상황:</span>
                 <Typewriter text={displayData.previousAnswerProsCons} speed={10} />
               </div>
            )}

            {/* 메인 대화창 박스 */}
            <div className="relative bg-white/95 border-4 border-sea-300 rounded-2xl p-5 sm:p-8 backdrop-blur-md shadow-xl mx-2 sm:mx-0">
              {/* 진행자 태그 */}
              <div className="absolute -top-5 left-6 bg-sea-500 text-white font-bold px-5 py-2 rounded-full border-2 border-white shadow-md text-base">
                진행자 어촌계장 ⚓
              </div>
              
              <div className="mt-2 text-gray-800 font-bold text-xl sm:text-2xl leading-relaxed min-h-[60px] whitespace-pre-wrap break-words">
                {!showFeedback ? (
                  <Typewriter 
                    text={displayData.questionText} 
                    speed={25} 
                    onComplete={() => setTypewriterDone(true)} 
                  />
                ) : (
                  <div>
                    <span className="text-sea-600 font-extrabold mb-3 block text-2xl">
                      💡 계장님의 조언:
                    </span>
                    <Typewriter text={displayData.feedback} speed={25} />
                  </div>
                )}
              </div>
            </div>

            {/* 선택지 영역 (타이핑이 끝난 후 표시되도록) */}
            {!showFeedback && typewriterDone && (
              <div className="mt-4 grid grid-cols-1 gap-3 animate-fadeInUp mx-2 sm:mx-0">
                {displayData.options.map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className="group relative bg-white/95 border-2 border-sea-200 hover:border-sea-400 hover:bg-sea-50 p-4 sm:p-5 rounded-xl text-left transition-all overflow-hidden shadow-sm hover:shadow-md flex items-start"
                  >
                    <span className="relative z-10 text-sea-500 font-extrabold mr-3 text-xl shrink-0">[{opt.label}]</span>
                    <span className="relative z-10 text-gray-800 group-hover:text-sea-700 font-bold text-lg sm:text-xl break-words whitespace-pre-wrap flex-1">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* 피드백 완료 후 다음 라운드로 버튼 */}
            {showFeedback && (
              <div className="mt-5 flex justify-end animate-fadeInUp delay-500 mr-2 sm:mr-0">
                <button
                  onClick={handleNext}
                  className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-extrabold py-4 px-10 rounded-full shadow-[0_4px_0_rgb(180,83,9)] transition-transform transform hover:translate-y-1 active:shadow-none flex items-center text-xl border-2 border-amber-600"
                >
                  {currentRoundIndex === 3 ? '여정 완료! 🦀' : '다음 거점으로 이동! ⛵'} 
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
