import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type {  LearnerState  } from '../types';

export const submitLearningData = async (state: LearnerState) => {
  if (!state.learner || !state.level || !state.scenarioData || !state.summaryData) {
    throw new Error('필수 학습 데이터가 누락되었습니다.');
  }

  try {
    // 1. Prepare Payload
    const payload = {
      submittedAt: serverTimestamp(),
      learner: {
        name: state.learner.name || '',
        ageGroup: state.learner.ageGroup || '',
        stage: state.learner.stage || '',
        gender: state.learner.gender || '선택안함'
      },
      preTestScore: state.preTestAnswers.filter((a, i) => a === state.preTestQuestions[i]?.correctIndex).length,
      level: state.level || '초급',
      topic: (state.topic === '직접 입력' ? state.customTopic : state.topic) || '',
      scenario: state.scenarioData.scenario || '',
      rounds: state.rounds.map(r => ({
        round: r.round || 0,
        questionText: r.questionText || '',
        selectedLabel: (r.selectedIndex !== null && r.options && r.options[r.selectedIndex]) ? (r.options[r.selectedIndex].label || '') : '',
        selectedText: (r.selectedIndex !== null && r.options && r.options[r.selectedIndex]) ? (r.options[r.selectedIndex].text || '') : '',
        feedback: r.feedback || '',
        actionImageUrl: r.actionImageUrl || null,
      })),
      summary: state.summaryData.summary || '',
      keyLearnings: state.summaryData.keyLearnings || [],
      practicalTips: state.summaryData.practicalTips || [],
      characterImageUrl: state.characterImageUrl || null,
      storageFilePath: '', // Will be updated later
    };

    // 2. Add to Firestore first to get the ID
    const docRef = await addDoc(collection(db, 'submissions'), payload);
    const submissionId = docRef.id;

    // 3. Upload JSON backup to Storage (Try-catch to prevent failure if only storage fails)
    let url = '';
    try {
      const jsonString = JSON.stringify(payload, null, 2);
      const storageRef = ref(storage, `submissions/${submissionId}.json`);
      await uploadString(storageRef, jsonString, 'raw', { contentType: 'application/json' });
      url = await getDownloadURL(storageRef);
    } catch (storageErr) {
      console.warn("Storage json backup upload failed, but firestore doc is created.", storageErr);
    }

    return { success: true, submissionId, url };
  } catch (error) {
    console.error('Submission failed:', error);
    throw error;
  }
};
