import type {  LearnerInfo, Level, Topic  } from '../types';

export const getPreTestPrompt = (learner: LearnerInfo) => {
  return `연령대: ${learner.ageGroup}, 창업단계: ${learner.stage}
{
  "questions": [
    {
      "question": "문제 텍스트",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "correctIndex": 0,
      "explanation": "정답 해설"
    }
  ]
}`;
};

export const getScenarioPrompt = (learner: LearnerInfo, level: Level, topic: Topic | string) => {
  return `이름: ${learner.name}, 연령대: ${learner.ageGroup}, 창업단계: ${learner.stage}, 수준: ${level}, 주제: ${topic}
{
  "scenario": "실제 업체 배경의 현실 문제 상황 (2~3 문단)",
  "problemStatement": "핵심 문제 요약 (1~2 문장)",
  "context": ["배경 정보 1", "배경 정보 2", "배경 정보 3"]
}`;
};

export const getRoundPrompt = (
  scenario: string,
  problemStatement: string,
  roundNumber: number,
  previousRounds: string,
  level: Level
) => {
  return `시나리오: ${scenario}
핵심 문제: ${problemStatement}
현재 라운드: ${roundNumber}/3
이전 선택 이력: ${previousRounds}
학습자 수준: ${level}

중요: 반드시 5개의 선택지(A, B, C, D, E)를 제공해야 합니다. 5개 모두 명백한 오답이 아니라, 각기 다른 관점이나 상황에서 문제 해결 방안이 될 수 있는 합리적이고 타당한 방법이어야 합니다. 그 중 가장 추천하는 1가지를 correctIndex로 지정하세요.
{
  "questionText": "이번 라운드 질문",
  "options": [
    { "label": "A", "text": "합리적인 선택지 1" },
    { "label": "B", "text": "합리적인 선택지 2" },
    { "label": "C", "text": "합리적인 선택지 3" },
    { "label": "D", "text": "합리적인 선택지 4" },
    { "label": "E", "text": "합리적인 선택지 5" }
  ],
  "correctIndex": 0,
  "feedbackIfCorrect": "이 방법이 가장 추천되는 이유와 긍정적 효과 분석",
  "feedbackIfWrong": "이 선택지도 문제 해결에 도움을 줄 수 있는 이유 및 발생할 수 있는 트레이드오프 분석"
}`;
};

export const getSummaryPrompt = (
  learner: LearnerInfo,
  level: Level,
  topic: Topic | string,
  scenario: string,
  roundsHistory: string
) => {
  return `학습자 정보: ${learner.name}, ${learner.ageGroup}, ${learner.stage}
수준: ${level}, 주제: ${topic}
시나리오: ${scenario}
${roundsHistory}

중요: summary(학습 핵심 요약) 작성 시, 문제에 대해 '학습자가 선택한 답들'을 명시적으로 제시하고, 그 답들이 문제 해결에 왜 효과가 있는지에 대한 분석을 반드시 포함해 주세요.
{
  "summary": "학습자가 선택한 답들을 나열하고 그 효과를 분석하는 결론 요약 (4~5 문장)",
  "keyLearnings": ["핵심 배움 1", "핵심 배움 2", "핵심 배움 3"],
  "practicalTips": ["실무 팁 1", "실무 팁 2", "실무 팁 3"],
  "encouragement": "${learner.name}님 맞춤 격려 메시지"
}`;
};
