import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Users, Clock, FileText, Trash2 } from 'lucide-react';

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
      const data = snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
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

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`${name} 학생의 데이터를 정말 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.`)) {
      try {
        await deleteDoc(doc(db, 'submissions', id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [filterStage, setFilterStage] = useState('');

  const filteredSubmissions = submissions.filter(sub => {
    const matchName = searchTerm ? sub.learner?.name?.includes(searchTerm) : true;
    const matchLevel = filterLevel ? sub.level === filterLevel : true;
    const matchGender = filterGender ? sub.learner?.gender === filterGender : true;
    const matchAge = filterAge ? sub.learner?.ageGroup === filterAge : true;
    const matchStage = filterStage ? sub.learner?.stage === filterStage : true;

    return matchName && matchLevel && matchGender && matchAge && matchStage;
  });

  const stats = {
    beginner: filteredSubmissions.filter(s => s.level === '초급').length,
    intermediate: filteredSubmissions.filter(s => s.level === '중급').length,
    advanced: filteredSubmissions.filter(s => s.level === '고급').length,
  };
  const totalSubmissions = filteredSubmissions.length;
  const maxStat = Math.max(stats.beginner, stats.intermediate, stats.advanced, 1);

  return (
    <div className="min-h-screen bg-sea-50">
      <header className="bg-white shadow-sm border-b border-sea-100">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sea-400 hover:text-sea-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </Link>
            <h1 className="text-2xl font-bold text-sea-600 font-serif">교사 대시보드</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sea-200 border-t-sea-600"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-soft">
            <div className="bg-sea-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-sea-400">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-base mb-2">아직 제출된 결과가 없습니다</h3>
            <p className="text-text-muted">학생들이 시나리오를 완료하면 여기에 결과가 나타납니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 검색 및 필터 UI */}
            <div className="bg-white rounded-3xl p-6 shadow-soft flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-bold text-gray-700 mb-2">학생 이름 검색</label>
                <input
                  type="text"
                  placeholder="이름 입력..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-sea-400 focus:ring-0 transition-colors"
                />
              </div>
              
              <div className="w-32">
                <label className="block text-sm font-bold text-gray-700 mb-2">진단 수준</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-sea-400 bg-white"
                >
                  <option value="">전체</option>
                  <option value="초급">초급</option>
                  <option value="중급">중급</option>
                  <option value="고급">고급</option>
                </select>
              </div>

              <div className="w-32">
                <label className="block text-sm font-bold text-gray-700 mb-2">성별</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-sea-400 bg-white"
                >
                  <option value="">전체</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                  <option value="선택안함">선택안함</option>
                </select>
              </div>

              <div className="w-32">
                <label className="block text-sm font-bold text-gray-700 mb-2">연령대</label>
                <select
                  value={filterAge}
                  onChange={(e) => setFilterAge(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-sea-400 bg-white"
                >
                  <option value="">전체</option>
                  <option value="20대">20대</option>
                  <option value="30대">30대</option>
                  <option value="40대">40대</option>
                  <option value="50대">50대</option>
                  <option value="60대">60대</option>
                  <option value="70대">70대</option>
                  <option value="80대 이상">80대 이상</option>
                </select>
              </div>

              <div className="w-36">
                <label className="block text-sm font-bold text-gray-700 mb-2">창업단계</label>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-sea-400 bg-white"
                >
                  <option value="">전체</option>
                  <option value="예비창업자">예비창업자</option>
                  <option value="실무자">실무자</option>
                  <option value="관리자">관리자</option>
                  <option value="대표자">대표자</option>
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* 좌측: 진단평가 수준 데이터 막대그래프 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl shadow-soft p-6">
                <div className="flex items-center gap-2 mb-6 text-sea-600">
                  <BarChart3 size={24} />
                  <h2 className="text-xl font-bold">학생 진단평가 수준</h2>
                </div>
                
                <div className="flex justify-between items-end h-48 mb-4 gap-4 px-2">
                  {/* 초급 */}
                  <div className="flex flex-col items-center flex-1 group h-full">
                    <div className="text-sm font-bold text-text-muted mb-2">{stats.beginner}명</div>
                    <div className="w-full bg-sea-100 rounded-t-lg relative overflow-hidden flex flex-col justify-end h-full">
                      <div 
                        className="bg-sea-400 w-full rounded-t-lg transition-all duration-700 ease-out group-hover:bg-sea-500" 
                        style={{ height: `${(stats.beginner / maxStat) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 font-medium text-sm text-text-base">초급</div>
                  </div>
                  
                  {/* 중급 */}
                  <div className="flex flex-col items-center flex-1 group h-full">
                    <div className="text-sm font-bold text-text-muted mb-2">{stats.intermediate}명</div>
                    <div className="w-full bg-sea-100 rounded-t-lg relative overflow-hidden flex flex-col justify-end h-full">
                      <div 
                        className="bg-blue-400 w-full rounded-t-lg transition-all duration-700 ease-out group-hover:bg-blue-500" 
                        style={{ height: `${(stats.intermediate / maxStat) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 font-medium text-sm text-text-base">중급</div>
                  </div>
                  
                  {/* 고급 */}
                  <div className="flex flex-col items-center flex-1 group h-full">
                    <div className="text-sm font-bold text-text-muted mb-2">{stats.advanced}명</div>
                    <div className="w-full bg-sea-100 rounded-t-lg relative overflow-hidden flex flex-col justify-end h-full">
                      <div 
                        className="bg-purple-400 w-full rounded-t-lg transition-all duration-700 ease-out group-hover:bg-purple-500" 
                        style={{ height: `${(stats.advanced / maxStat) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 font-medium text-sm text-text-base">고급</div>
                  </div>
                </div>
                
                <div className="border-t border-sea-100 pt-4 mt-2 text-center text-sm text-text-muted">
                  총 참여 학생: <span className="font-bold text-sea-600">{totalSubmissions}명</span>
                </div>
              </div>
            </div>

            {/* 우측: 제출 답변 요약 피드 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
                <div className="p-6 border-b border-sea-100 bg-sea-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sea-600">
                    <Users size={24} />
                    <h2 className="text-xl font-bold">최신 학생 제출 요약</h2>
                  </div>
                </div>
                
                <div className="divide-y divide-sea-100">
                  {filteredSubmissions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">검색 조건에 맞는 학생이 없습니다.</div>
                  ) : 
                    filteredSubmissions.map((sub) => (
                      <div key={sub.id} className="p-6 hover:bg-sea-50/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-lg text-text-base">{sub.learner?.name} 학생</h3>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                sub.level === '초급' ? 'bg-sea-100 text-sea-600' :
                                sub.level === '중급' ? 'bg-blue-100 text-blue-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                                {sub.level}
                              </span>
                            </div>
                            <p className="text-sm text-text-muted">
                              {sub.learner?.ageGroup} · {sub.learner?.stage}
                            </p>
                          </div>
                          <div className="text-xs text-text-muted flex items-center gap-1">
                            <Clock size={14} />
                            {sub.submittedAt ? new Date(sub.submittedAt.toDate()).toLocaleString() : '방금 전'}
                          </div>
                        </div>
                        
                        <div className="bg-sand-50 p-4 rounded-xl mb-4 border border-sand-200">
                          <h4 className="font-bold text-sm text-sand-800 mb-1">선택 주제</h4>
                          <p className="text-text-base font-medium">{sub.topic}</p>
                        </div>

                        <div className="bg-coral-50 p-4 rounded-xl">
                          <h4 className="font-bold text-sm text-coral-800 mb-2">학습 요약 (AI 진단)</h4>
                          <p className="text-sm text-text-base leading-relaxed line-clamp-3">
                            {sub.summary || '요약 정보가 없습니다.'}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => handleDelete(sub.id, sub.learner?.name)}
                            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={16} />
                            <span>삭제</span>
                          </button>
                          <Link 
                            to={`/admin/dashboard/${sub.id}`} 
                            className="inline-block text-sm bg-sea-100 text-sea-700 hover:bg-sea-200 px-4 py-2 rounded-lg font-bold transition-colors"
                          >
                            상세 리포트 보기
                          </Link>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            
          </div>
          </div>
        )}
      </main>
    </div>
  );
}
