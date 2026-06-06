export type AgeGroup =
  '20대' | '30대' | '40대' | '50대' | '60대' | '70대' | '80대 이상';

export type StartupStage =
  '예비창업자' | '실무자' | '관리자' | '대표자';

export type Gender = '남성' | '여성' | '선택안함';

export type Level = '초급' | '중급' | '고급';

export type Topic =
  '마케팅' | '수산물 가공 기술' | '세무 및 정산' | '직접 입력';

export interface LearnerInfo {
  name: string;
  ageGroup: AgeGroup;
  stage: StartupStage;
  gender: Gender;
}

export interface PreTestQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface QuizRound {
  round: number;
  previousAnswerProsCons?: string;
  questionText: string;
  options: { label: string; text: string }[];
  correctIndex: number;
  selectedIndex: number | null;
  feedback: string;
  actionImageUrl?: string;
}

export interface ScenarioData {
  scenario: string;
  problemStatement: string;
  context: string[];
}

export interface SummaryData {
  summary: string;
  keyLearnings: string[];
  practicalTips: string[];
  encouragement: string;
}

export interface LearnerState {
  step: number;
  learner: LearnerInfo | null;
  preTestQuestions: PreTestQuestion[];
  preTestAnswers: number[];
  level: Level | null;
  topic: Topic | null;
  customTopic: string;
  scenarioData: ScenarioData | null;
  rounds: QuizRound[];
  summaryData: SummaryData | null;
  characterImageUrl: string | null;
}
