import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { startBackgroundWarmup } from './services/backendWarmup';

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
  useEffect(() => {
    // Fire-and-forget: wake up the backend silently in the background.
    // The app loads immediately — no blocking at all.
    startBackgroundWarmup();
  }, []);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
