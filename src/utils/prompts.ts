import type {  LearnerInfo, Level, Topic  } from '../types';

export const getPreTestPrompt = (learner: LearnerInfo) => {
  return `연령대: ${learner.ageGroup}, 창업단계: ${learner.stage}
중요: 문제와 선택지, 해설에는 가능한 한 모호한 표현을 피하고 비용, 확률, 퍼센트(%), 온도, 시간 등 구체적이고 객관적인 수치를 포함하여 현실적으로 구성하세요. 또한, 해설 제공 시 정답에 대해서만 반드시 [장점] 1개와 [단점] 1개를 명확하게 표기해 주세요.
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
3. **매우 중요**: 다음 라운드의 질문은 반드시 학습자가 직전에 선택한 답변의 **'단점(또는 한계점)'을 해결하거나 보완해야 하는 상황**으로 제시하세요. 꼬리에 꼬리를 무는 형태로 문제 상황이 이어져야 합니다. (라운드 1은 예외)
4. 질문과 선택지는 반드시 학습자의 연령대(${learner.ageGroup}), 창업단계(${learner.stage}) 및 진단평가 수준(${level})을 반영하여 현실적이고 적절한 난이도와 맥락으로 구성하세요.
5. **매우 중요**: 반드시 3개의 선택지(A, B, C)를 제공하되, 3개 모두 **정답이 될 수 있는 합리적인 선택지**로 제공하세요. 틀린 오답을 만들지 마세요. 각기 다른 전략이나 관점을 가진 타당한 방법이어야 합니다. 그 중 가장 무난하거나 추천하는 1가지를 correctIndex로 지정하세요.
6. 질문과 선택지는 가독성을 위해 간결하게 작성하되, **피드백 및 해설(장단점 분석)은 구체적인 비즈니스 상황, 실무적 이유, 예상되는 결과 등을 포함하여 상세하게(각각 3~4문장 이상) 설명**해주세요.
7. 해설과 피드백(previousAnswerProsCons, feedbackIfCorrect, feedbackIfWrong 등) 작성 시 다른 선택지나 답변에 대한 언급은 절대 피하고, **오직 학습자가 '선택한 해당 답변'**에 대해서만 피드백을 제공하세요. 반드시 **[장점] 1개**와 **[단점] 1개**만 명확히 키워드를 사용하여 객관적이고 깊이 있게 피드백해주세요.

{
  "previousAnswerProsCons": "[장점]: 구체적인 실무적 이유를 포함한 상세한 설명... \\n[단점]: 예상되는 한계점이나 리스크에 대한 상세한 설명...",
  "questionText": "이번 라운드 질문 (간결하게 1~2문장으로 압축)",
  "options": [
    { "label": "A", "text": "짧고 명확한 선택지 1" },
    { "label": "B", "text": "짧고 명확한 선택지 2" },
    { "label": "C", "text": "짧고 명확한 선택지 3" }
  ],
  "correctIndex": 0,
  "feedbackIfCorrect": "[장점]: 해당 선택의 구체적인 기대효과... \\n[단점]: 발생할 수 있는 리스크나 기회비용...",
  "feedbackIfWrong": "[장점]: 이 선택지가 가지는 고유의 장점... \\n[단점]: 실무에서 부딪힐 수 있는 구체적인 한계..."
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
