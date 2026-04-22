import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Register from './pages/Register';
import Profile from './pages/Profile';

import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateTest from './pages/CreateTest';
import StudentDashboard from './pages/StudentDashboard';
import TestTakingView from './pages/TestTakingView';
import StudentResults from './pages/StudentResults';
import ReviewTest from './pages/ReviewTest';

import TeacherTestResults from './pages/TeacherTestResults';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const RootRedirect = () => {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dark-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
            <Header />
          
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Teacher Routes */}
              <Route path="/teacher/dashboard" element={
                <ProtectedRoute role="TEACHER"><TeacherDashboard /></ProtectedRoute>
              } />
              <Route path="/teacher/create-test" element={
                <ProtectedRoute role="TEACHER"><CreateTest /></ProtectedRoute>
              } />
              <Route path="/teacher/review/:testId" element={
                <ProtectedRoute role="TEACHER"><ReviewTest /></ProtectedRoute>
              } />
              <Route path="/teacher/test-results/:testId" element={
                <ProtectedRoute role="TEACHER"><TeacherTestResults /></ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>
              } />
              <Route path="/student/test/:testId" element={
                <ProtectedRoute role="STUDENT"><TestTakingView /></ProtectedRoute>
              } />
              <Route path="/student/results/:testId" element={
                <ProtectedRoute role="STUDENT"><StudentResults /></ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
