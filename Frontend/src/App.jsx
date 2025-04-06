import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout'; // Ensure this file exists
import Home from './Components/Browse Quizzes/Home'; // Adjusted path for consistency
import Dashboard from './Components/Dashboard/Dashboard';
import QuizForm from './Components/Quiz/QuizForm';
import GeneratedResponse from './Components/Quiz/GeneratedResponse';
import AIQuizGenerator from './Components/Quiz/AIQuizGenerator';
import QuizTest from './Components/QuizTestPage/QuizTest';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import Profile from './Components/Profile/Profile';
import { useAuth } from './context/auth.context';
import errorImage from '/404error.svg'; // Adjusted path (assuming it's in src/assets)
import LandingPage from './Layout/LangidPage'; // Fixed typo

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes with Layout */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/quizzes" replace />} /> {/* Redirect to quizzes */}
          
          {/* Dashboard */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Quiz Management */}
          <Route
            path="create-quiz"
            element={
              <ProtectedRoute>
                <QuizForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="edit-quiz/:id"
            element={
              <ProtectedRoute>
                <QuizForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="quiz-response/:id"
            element={
              <ProtectedRoute>
                <GeneratedResponse />
              </ProtectedRoute>
            }
          />

          <Route
            path="generate-quiz"
            element={
              <ProtectedRoute>
                <AIQuizGenerator />
              </ProtectedRoute>
            }
          />

          {/* User Profile */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Public Quiz Browsing */}
          <Route
            path="quizzes"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="quiz/test"
            element={
              <ProtectedRoute>
                <QuizTest />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Error Page */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center min-h-screen">
              <img src={errorImage} alt="404 Not Found" className="w-[600px]" />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}