import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import AppLayout from '@/components/layout/AppLayout';
import { TaskProvider } from '@/hooks/useTasks';

// Public pages
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Demo = lazy(() => import('@/pages/Demo'));

// Authenticated pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Timeline = lazy(() => import('@/pages/Timeline'));
const Assignments = lazy(() => import('@/pages/Assignments'));
const AssignmentDetail = lazy(() => import('@/pages/AssignmentDetail'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Settings = lazy(() => import('@/pages/settings')); // <-- Added

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/demo" element={<Demo />} />

              {/* Authenticated routes */}
              <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/assignments/:id" element={<AssignmentDetail />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/availability" element={<Settings />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}
