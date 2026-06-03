import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'submissions'),
      orderBy('submittedAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching submissions: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-sea-50">
      <header className="bg-white shadow-sm border-b border-sea-100">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sea-600 font-serif">관리자 대시보드</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-soft rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-sea-100 bg-sea-50">
            <h2 className="text-xl font-bold text-text-base">제출 결과 목록</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-text-muted">데이터를 불러오는 중입니다...</div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-text-muted">아직 제출된 학습 결과가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sea-100">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">제출일</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">이름</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">창업단계</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">수준</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">주제</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">상세</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sea-50">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-sea-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                        {sub.submittedAt ? new Date(sub.submittedAt.toDate()).toLocaleString() : '방금 전'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-base">
                        {sub.learner?.name} ({sub.learner?.ageGroup})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                        {sub.learner?.stage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          sub.level === '초급' ? 'bg-sea-100 text-sea-600' :
                          sub.level === '중급' ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {sub.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                        {sub.topic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/admin/dashboard/${sub.id}`} className="text-coral-400 hover:text-coral-600 font-bold">
                          보기 →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
