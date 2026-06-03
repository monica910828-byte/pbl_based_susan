import type {  LearnerInfo, Level, Topic  } from '../types';

export const getPreTestPrompt = (learner: LearnerInfo) => {
  return `연령대: ${learner.ageGroup}, 창업단계: ${learner.stage}
중요: 문제와 선택지, 해설에는 가능한 한 모호한 표현을 피하고 비용, 확률, 퍼센트(%), 온도, 시간 등 구체적이고 객관적인 수치를 포함하여 현실적으로 구성하세요. 또한, 해설 제공 시 각 선택지에 대해 [장점]과 [단점]을 명확하게 표기해 주세요.
{
  "questions": [
    {
      "question": "문제 텍스트",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "correctIndex": 0,
      "explanation": "[장점]: ... \\n[단점]: ... 형태를 포함하는 정답 해설"
    }
  ]
}`;
};

export const getScenarioPrompt = (learner: LearnerInfo, level: Level, topic: Topic | string) => {
  return `이름: ${learner.name}, 연령대: ${learner.ageGroup}, 창업단계: ${learner.stage}, 수준: ${level}, 주제: ${topic}
중요: 시나리오 내용과 배경 정보(context)에는 반드시 예산, 불량률, 매출액, 온도, 기간 등 구체적이고 객관적인 수치 데이터를 포함하여 현실감 있게 작성하세요.
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
  level: Level,
  learner: LearnerInfo
) => {
  return `시나리오: ${scenario}
핵심 문제: ${problemStatement}
현재 라운드: ${roundNumber}/3
이전 선택 이력: ${previousRounds}
학습자 수준: ${level}
학습자 정보: 연령대(${learner.ageGroup}), 창업단계(${learner.stage})

요구사항:
1. 다음 질문은 반드시 학습자가 '이전 선택 이력'에서 직전에 선택한 답변과 유기적으로 연관된 심화/후속 질문이어야 합니다.
2. 질문 제시 전, 학습자가 직전에 선택한 답변의 장점과 단점(또는 한계점)을 명확히 분석하여 'previousAnswerProsCons' 필드에 작성하세요. (라운드 1일 경우 빈 문자열)
3. 질문과 선택지는 반드시 학습자의 연령대(${learner.ageGroup}), 창업단계(${learner.stage}) 및 진단평가 수준(${level})을 반영하여 현실적이고 적절한 난이도와 맥락으로 구성하세요.
4. 반드시 5개의 선택지(A, B, C, D, E)를 제공해야 합니다. 5개 모두 명백한 오답이 아니라, 각기 다른 관점이나 상황에서 문제 해결 방안이 될 수 있는 합리적이고 타당한 방법이어야 합니다. 그 중 가장 추천하는 1가지를 correctIndex로 지정하세요.
5. 모든 텍스트(질문, 선택지, 피드백, 장단점 분석 등)에는 모호한 표현을 피하고, 기대 수익률, 비용 절감률(%), 예상 소요 시간, 온도/습도 등 객관적이고 정량적인 수치를 적극적으로 포함하여 제시하세요.
6. 해설과 피드백(previousAnswerProsCons, feedbackIfCorrect, feedbackIfWrong 등) 작성 시 반드시 "[장점]"과 "[단점]"이라는 키워드를 사용하여 장단점을 명확히 대비시켜 표기하세요.

{
  "previousAnswerProsCons": "[장점]: ... \\n[단점]: ... 형태로 직전 선택의 장단점 분석 (1라운드는 빈 문자열)",
  "questionText": "이번 라운드 질문 (이전 답변과 연관, 학습자 정보/수준 반영)",
  "options": [
    { "label": "A", "text": "합리적인 선택지 1" },
    { "label": "B", "text": "합리적인 선택지 2" },
    { "label": "C", "text": "합리적인 선택지 3" },
    { "label": "D", "text": "합리적인 선택지 4" },
    { "label": "E", "text": "합리적인 선택지 5" }
  ],
  "correctIndex": 0,
  "feedbackIfCorrect": "[장점]: 이 방법의 긍정적 효과 \\n[단점]: 발생 가능한 한계점",
  "feedbackIfWrong": "[장점]: 이 선택지가 갖는 의의 \\n[단점]: 이 선택지의 트레이드오프나 한계"
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

중요: 
1. summary(학습 핵심 요약) 작성 시, 문제에 대해 '학습자가 선택한 답들'을 명시적으로 제시하고, 그 답들이 문제 해결에 왜 효과가 있는지에 대한 분석을 반드시 포함해 주세요.
2. 결론 요약, 핵심 배움, 실무 팁 등을 작성할 때, 막연한 설명보다는 퍼센트(%), 예상 매출 증가액, 단축 시간, 생산량 증가치 등 구체적이고 객관적인 수치(정량적 데이터)를 적극적으로 포함하세요.
3. 학습자의 선택을 분석하거나 실무 팁을 제공할 때, 그 방법들의 [장점]과 [단점]을 명확한 키워드와 함께 구분하여 표기해 주세요.
{
  "summary": "학습자가 선택한 답들의 [장점]과 [단점]을 포함하여 분석하는 결론 요약 (4~5 문장)",
  "keyLearnings": ["핵심 배움 1", "핵심 배움 2", "핵심 배움 3"],
  "practicalTips": ["실무 팁 1", "실무 팁 2", "실무 팁 3"],
  "encouragement": "${learner.name}님 맞춤 격려 메시지"
}`;
};
