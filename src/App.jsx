import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import SearchLibraryPage from './pages/SearchLibraryPage';
import CurriculumsPage from './pages/CurriculumsPage';
import CurriculumDetailPage from './pages/CurriculumDetailPage';
import FoldersPage from './pages/FoldersPage';
import LoginPage from './pages/LoginPage';
import Spinner from './components/ui/Spinner';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  // In demo pitch mode, auto-authenticate if no user stored
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Main Application Tabs */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/search" element={<SearchLibraryPage />} />
            <Route path="/curriculums" element={<CurriculumsPage />} />
            <Route path="/curriculums/:id" element={<CurriculumDetailPage />} />
            <Route path="/folders" element={<FoldersPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
