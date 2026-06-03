import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LearningFlow } from '../components/LearningFlow';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { SubmissionDetail } from '../components/admin/SubmissionDetail';
import { ProtectedRoute } from './ProtectedRoute';
import { LearnerProvider } from '../context/LearnerContext';

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LearnerProvider>
              <LearningFlow />
            </LearnerProvider>
          }
        />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/:id"
          element={
            <ProtectedRoute>
              <SubmissionDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
