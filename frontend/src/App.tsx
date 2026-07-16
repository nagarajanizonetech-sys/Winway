import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import BackendLoader from './components/BackendLoader';
import { warmupBackend, stopKeepAlive } from './services/backendWarmup';
import type { WarmupStatus } from './services/backendWarmup';

const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

function AppLayout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen" style={{ background: "#F3E9DC" }}>
            <div className="h-9 w-9 animate-spin rounded-full border-4" style={{ borderColor: "#D6B98C", borderTopColor: "transparent" }} />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<h1>Test Route Working</h1>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  const [warmupStatus, setWarmupStatus] = useState<WarmupStatus | null>({
    phase: 'waking',
    attempt: 1,
  });

  useEffect(() => {
    warmupBackend((status) => {
      setWarmupStatus(status);

      // Hide the loader shortly after backend is ready or timed out
      if (status.phase === 'ready' || status.phase === 'timeout') {
        setTimeout(() => setWarmupStatus(null), 600);
      }
    });

    return () => stopKeepAlive();
  }, []);

  return (
    <>
      {/* Show loading overlay while backend is cold-starting */}
      <BackendLoader status={warmupStatus} />

      <Router>
        <AppLayout />
      </Router>
    </>
  );
}

export default App;
