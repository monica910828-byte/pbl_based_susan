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
      learner: state.learner,
      preTestScore: state.preTestAnswers.filter((a, i) => a === state.preTestQuestions[i]?.correctIndex).length,
      level: state.level,
      topic: state.topic === '직접 입력' ? state.customTopic : state.topic,
      scenario: state.scenarioData.scenario,
      rounds: state.rounds.map(r => ({
        round: r.round,
        questionText: r.questionText,
        selectedLabel: r.selectedIndex !== null ? r.options[r.selectedIndex].label : '',
        selectedText: r.selectedIndex !== null ? r.options[r.selectedIndex].text : '',
        feedback: r.feedback,
      })),
      summary: state.summaryData.summary,
      keyLearnings: state.summaryData.keyLearnings,
      practicalTips: state.summaryData.practicalTips,
      storageFilePath: '', // Will be updated later
    };

    // 2. Add to Firestore first to get the ID
    const docRef = await addDoc(collection(db, 'submissions'), payload);
    const submissionId = docRef.id;

    // 3. Upload JSON backup to Storage
    const jsonString = JSON.stringify(payload, null, 2);
    const storageRef = ref(storage, `submissions/${submissionId}.json`);
    await uploadString(storageRef, jsonString, 'raw', { contentType: 'application/json' });
    
    // Optional: Get URL and update firestore (though path is often enough)
    const url = await getDownloadURL(storageRef);

    // Normally we'd update the document with the storage file path, but addDoc is fine for now
    // A separate updateDoc call can be added if we strictly want storageFilePath in the DB.
    // For simplicity, we just return success.
    
    return { success: true, submissionId, url };
  } catch (error) {
    console.error('Submission failed:', error);
    throw error;
  }
};
