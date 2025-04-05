import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Components/Browse Quizzes/Home';
import Dashboard from './Components/Dashboard/Dashboard';
import QuizForm from './Components/Quiz/QuizForm';
import GeneratedResponse from './Components/Quiz/GeneratedResponse';
import AIQuizGenerator from './Components/Quiz/AIQuizGenerator';
import QuizTest from './Components/QuizTestPage/QuizTest';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import Profile from './Components/Profile/Profile';
import { useAuth } from './context/auth.context';
import errorImage from '/404error.svg'; // Ensure correct image path

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          {/* Redirect from root to dashboard or quizzes */}
          <Route index element={<Navigate to="/quizes" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Quiz Management */}
          <Route path="/create-quiz" element={
            <ProtectedRoute>
              <QuizForm />
            </ProtectedRoute>
          } />

          <Route path="/edit-quiz/:id" element={
            <ProtectedRoute>
              <QuizForm />
            </ProtectedRoute>
          } />

          <Route path="/quiz-response/:id" element={
            <ProtectedRoute>
              <GeneratedResponse />
            </ProtectedRoute>
          } />

          <Route path="/generate-quiz" element={
            <ProtectedRoute>
              <AIQuizGenerator />
            </ProtectedRoute>
          } />

          {/* User Profile */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Public Routes */}
          <Route path="/quizes" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />

          <Route path="/quiz/test" element={
            <ProtectedRoute>
              <QuizTest />
            </ProtectedRoute>

          } />
        </Route>

        {/* 404 Error Page */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center min-h-screen">
              <img src={errorImage} alt="404 Not Found" width={600} />
            </div>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}
