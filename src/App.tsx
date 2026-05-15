import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-8">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Something went wrong</h1>
            <p className="text-sm text-slate-400 font-bold">Please refresh the page. If the problem persists, contact IT support at it.support@cihe.edu.au</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand-indigo text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Support from './pages/Support';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import Results from './pages/Results';
import Finance from './pages/Finance';
import DigitalID from './pages/DigitalID';
import Forms from './pages/Forms';
import RollCall from './pages/RollCall';
import Settings from './pages/Settings';
import Shell from './components/layout/Shell';
import Announcements from './pages/Announcements';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Shell>{children}</Shell>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!['lecturer', 'staff', 'admin', 'global_admin'].includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }
  return <Shell>{children}</Shell>;
}

function StudentRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'student') return <Navigate to="/" replace />;
  return <Shell>{children}</Shell>;
}

export default function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/timetable" 
            element={
              <ProtectedRoute>
                <Timetable />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/finance"
            element={
              <StudentRoute>
                <Finance />
              </StudentRoute>
            }
          />

          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } 
          />
          
          <Route
            path="/roll-call"
            element={
              <AdminRoute>
                <RollCall />
              </AdminRoute>
            }
          />

          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/digital-id" 
            element={
              <ProtectedRoute>
                <DigitalID />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/forms" 
            element={
              <ProtectedRoute>
                <Forms />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}
