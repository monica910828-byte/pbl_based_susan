import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Trash2, Sparkles } from 'lucide-react';
import { useGPT } from '../../hooks/useGPT';

export function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { fetchGPT, loading: gptLoading, error: gptError } = useGPT();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'submissions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setError('해당 제출 내역을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !data) return;
    if (window.confirm(`${data.learner.name} 학생의 데이터를 정말 삭제하시겠습니까?`)) {
      try {
        await deleteDoc(doc(db, 'submissions', id));
        navigate('/admin/dashboard');
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const generateTeacherAnalysis = async () => {
    if (!id || !data) return;
    
    const roundsText = data.rounds?.map((r: any) => 
      `Round ${r.round}: 질문(${r.questionText}), 선택(${r.selectedLabel}) ${r.selectedText})\n피드백: ${r.feedback}`
    ).join('\n\n');

    const prompt = `
[학생 정보]
이름: ${data.learner.name}
연령대: ${data.learner.ageGroup}
창업단계: ${data.learner.stage}
수준: ${data.level}
선택 주제: ${data.topic}

[사전 테스트 점수]
${data.preTestScore} / 5

[라운드 진행 내역]
${roundsText}
    `;

    const result = await fetchGPT({
      systemPrompt: '당신은 수산식품 가공 분야의 전문 교사 멘토입니다. 제시된 학생의 PBL 학습 결과를 분석하고, 추가로 학습이 필요한 내용을 정리해주세요. 반드시 다음 JSON 스키마 형식으로 응답하세요: { "analysis": "학습 결과 분석", "additionalStudy": ["추가 학습 가이드 1", "추가 학습 가이드 2"] }',
      userPrompt: prompt,
      jsonMode: true,
    });

    if (result && result.analysis) {
      try {
        const docRef = doc(db, 'submissions', id);
        await updateDoc(docRef, { teacherAnalysis: result });
        setData({ ...data, teacherAnalysis: result });
      } catch (err) {
        console.error('Error saving analysis:', err);
        alert('분석 결과를 저장하는 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) return <LoadingSpinner message="상세 데이터를 불러오는 중입니다..." />;
  if (error) return <div className="text-center p-12 text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-sea-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/admin/dashboard" className="text-sea-600 hover:text-sea-800 font-bold flex items-center">
            ← 목록으로 돌아가기
          </Link>
          <div className="text-sm text-text-muted">
            제출일: {data.submittedAt ? new Date(data.submittedAt.toDate()).toLocaleString() : '알 수 없음'}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <div className="bg-sea-600 p-6 text-white flex justify-between items-center">
            <h2 className="text-2xl font-bold font-serif">{data.learner.name}님의 학습 결과</h2>
            <div className="flex items-center gap-3">
              <span className="bg-white text-sea-600 px-3 py-1 rounded-full text-sm font-bold">{data.level}</span>
              <span className="bg-coral-400 text-white px-3 py-1 rounded-full text-sm font-bold">{data.topic}</span>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center p-1.5 ml-2 bg-white/20 hover:bg-red-500/80 rounded-full transition-colors"
                title="삭제"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* 교사 참고용 AI 분석 리포트 */}
            <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex justify-between items-center mb-4 border-b border-blue-200 pb-2">
                <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                  <Sparkles size={20} />
                  교사 참고용 AI 분석 리포트
                </h3>
                {!data.teacherAnalysis && (
                  <button
                    onClick={generateTeacherAnalysis}
                    disabled={gptLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {gptLoading ? 'AI 분석 중...' : '학생 분석 및 추가 학습 가이드 생성'}
                  </button>
                )}
              </div>
              
              {gptError && <p className="text-red-500 text-sm mb-4">{gptError}</p>}

              {data.teacherAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-blue-700 mb-2">학습 결과 종합 분석</h4>
                    <p className="text-text-base leading-relaxed whitespace-pre-wrap">
                      {data.teacherAnalysis.analysis}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-coral-600 mb-2">추가 학습 필요 내용</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-text-base">
                      {data.teacherAnalysis.additionalStudy?.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                !gptLoading && (
                  <p className="text-sm text-blue-600/70 text-center py-4">
                    아직 분석 리포트가 생성되지 않았습니다. 버튼을 눌러 AI 분석을 시작하세요.
                  </p>
                )
              )}
            </section>

            <section>
              <h3 className="text-lg font-bold text-text-base mb-4 border-b pb-2">학습자 정보 & 캐릭터</h3>
              <div className="flex flex-col md:flex-row gap-6">
                {data.characterImageUrl && (
                  <div className="flex-shrink-0 w-32 h-32 bg-pink-50 rounded-2xl border-4 border-pink-200 overflow-hidden shadow-inner flex items-center justify-center">
                    <img src={data.characterImageUrl} alt="Character" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 bg-sea-50 p-4 rounded-xl">
                  <div>
                    <div className="text-sm text-text-muted">연령대</div>
                    <div className="font-bold">{data.learner.ageGroup}</div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">창업단계</div>
                    <div className="font-bold">{data.learner.stage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">사전 테스트 점수</div>
                    <div className="font-bold">{data.preTestScore} / 5</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-text-base mb-4 border-b pb-2">시나리오</h3>
              <div className="bg-sand-100 p-6 rounded-xl text-text-base whitespace-pre-wrap leading-relaxed">
                {data.scenario}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-text-base mb-4 border-b pb-2">라운드 진행 내역</h3>
              <div className="space-y-6">
                {data.rounds?.map((r: any, idx: number) => (
                  <div key={idx} className="border border-sea-200 rounded-xl overflow-hidden flex flex-col md:flex-row bg-white">
                    <div className="flex-1">
                      <div className="bg-sea-50 p-4 font-bold text-sea-600 border-b border-sea-100 flex items-center justify-between">
                        <span>Round {r.round} 거점 이동</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="font-bold">Q. {r.questionText}</p>
                        <p className="text-sm"><span className="text-coral-600 font-bold">선택:</span> {r.selectedLabel}) {r.selectedText}</p>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                          <span className="font-bold mb-1 block">피드백:</span>
                          {r.feedback}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-text-base mb-4 border-b pb-2">최종 결론 요약</h3>
              <div className="space-y-4">
                <div className="bg-coral-50 p-4 rounded-xl whitespace-pre-wrap leading-relaxed">
                  {data.summary}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-sea-600 mb-2">핵심 배움</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {data.keyLearnings?.map((k: string, i: number) => <li key={i}>{k}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-coral-600 mb-2">실무 적용 팁</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {data.practicalTips?.map((k: string, i: number) => <li key={i}>{k}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
