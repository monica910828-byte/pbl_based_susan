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
{
  "questionText": "이번 라운드 질문",
  "options": [
    { "label": "A", "text": "선택지 내용" },
    { "label": "B", "text": "선택지 내용" },
    { "label": "C", "text": "선택지 내용" },
    { "label": "D", "text": "선택지 내용" }
  ],
  "correctIndex": 0,
  "feedbackIfCorrect": "긍정 피드백",
  "feedbackIfWrong": "건설적 관점 제시 피드백"
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
{
  "summary": "학습 핵심 요약 (3~4 문장)",
  "keyLearnings": ["핵심 배움 1", "핵심 배움 2", "핵심 배움 3"],
  "practicalTips": ["실무 팁 1", "실무 팁 2", "실무 팁 3"],
  "encouragement": "${learner.name}님 맞춤 격려 메시지"
}`;
};
