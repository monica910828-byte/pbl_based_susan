import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {  LearnerState, LearnerInfo, PreTestQuestion, Level, Topic, ScenarioData, QuizRound, SummaryData  } from '../types';

type Action =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_LEARNER_INFO'; payload: LearnerInfo }
  | { type: 'SET_PRE_TEST_QUESTIONS'; payload: PreTestQuestion[] }
  | { type: 'SET_PRE_TEST_ANSWER'; payload: { index: number; answerIndex: number } }
  | { type: 'SET_LEVEL'; payload: Level }
  | { type: 'SET_TOPIC'; payload: { topic: Topic; customTopic?: string } }
  | { type: 'SET_SCENARIO'; payload: ScenarioData }
  | { type: 'SET_ROUNDS'; payload: QuizRound[] }
  | { type: 'UPDATE_ROUND_ANSWER'; payload: { roundIndex: number; selectedIndex: number } }
  | { type: 'SET_SUMMARY'; payload: SummaryData }
  | { type: 'RESET_ALL' }
  | { type: 'RESET_FROM_STEP_4' };

const initialState: LearnerState = {
  step: 1,
  learner: null,
  preTestQuestions: [],
  preTestAnswers: [],
  level: null,
  topic: null,
  customTopic: '',
  scenarioData: null,
  rounds: [],
  summaryData: null,
};

const LearnerContext = createContext<{
  state: LearnerState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function learnerReducer(state: LearnerState, action: Action): LearnerState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_LEARNER_INFO':
      return { ...state, learner: action.payload };
    case 'SET_PRE_TEST_QUESTIONS':
      return { ...state, preTestQuestions: action.payload, preTestAnswers: new Array(action.payload.length).fill(-1) };
    case 'SET_PRE_TEST_ANSWER': {
      const newAnswers = [...state.preTestAnswers];
      newAnswers[action.payload.index] = action.payload.answerIndex;
      return { ...state, preTestAnswers: newAnswers };
    }
    case 'SET_LEVEL':
      return { ...state, level: action.payload };
    case 'SET_TOPIC':
      return { ...state, topic: action.payload.topic, customTopic: action.payload.customTopic || '' };
    case 'SET_SCENARIO':
      return { ...state, scenarioData: action.payload };
    case 'SET_ROUNDS':
      return { ...state, rounds: action.payload };
    case 'UPDATE_ROUND_ANSWER': {
      const newRounds = [...state.rounds];
      newRounds[action.payload.roundIndex] = {
        ...newRounds[action.payload.roundIndex],
        selectedIndex: action.payload.selectedIndex,
      };
      return { ...state, rounds: newRounds };
    }
    case 'SET_SUMMARY':
      return { ...state, summaryData: action.payload };
    case 'RESET_ALL':
      return initialState;
    case 'RESET_FROM_STEP_4':
      return {
        ...state,
        step: 4,
        topic: null,
        customTopic: '',
        scenarioData: null,
        rounds: [],
        summaryData: null,
      };
    default:
      return state;
  }
}

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learnerReducer, initialState);

  return (
    <LearnerContext.Provider value={{ state, dispatch }}>
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (context === undefined) {
    throw new Error('useLearner must be used within a LearnerProvider');
  }
  return context;
}
