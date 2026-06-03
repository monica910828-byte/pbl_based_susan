import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <div className="flex gap-2">
              <span className="bg-white text-sea-600 px-3 py-1 rounded-full text-sm font-bold">{data.level}</span>
              <span className="bg-coral-400 text-white px-3 py-1 rounded-full text-sm font-bold">{data.topic}</span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-text-base mb-4 border-b pb-2">학습자 정보</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-sea-50 p-4 rounded-xl">
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
                  <div key={idx} className="border border-sea-200 rounded-xl overflow-hidden">
                    <div className="bg-sea-50 p-4 font-bold text-sea-600">Round {r.round}</div>
                    <div className="p-4 space-y-3">
                      <p className="font-bold">Q. {r.questionText}</p>
                      <p className="text-sm"><span className="text-coral-600 font-bold">선택:</span> {r.selectedLabel}) {r.selectedText}</p>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                        <span className="font-bold mb-1 block">피드백:</span>
                        {r.feedback}
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
