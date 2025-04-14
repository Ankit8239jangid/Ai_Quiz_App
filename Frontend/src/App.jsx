import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/auth.context';
import errorImage from '/404error.svg';

// Lazy load all components for better performance
const Layout = lazy(() => import('./Layout/Layout'));
const LandingPage = lazy(() => import('./Layout/LangidPage'));
const Home = lazy(() => import('./Components/Browse Quizzes/Home'));
const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard'));
const QuizForm = lazy(() => import('./Components/Quiz/QuizForm'));
const GeneratedResponse = lazy(() => import('./Components/Quiz/GeneratedResponse'));
const AIQuizGenerator = lazy(() => import('./Components/Quiz/AIQuizGenerator'));
const QuizTest = lazy(() => import('./Components/QuizTestPage/QuizTest'));
const Login = lazy(() => import('./Components/Auth/Login'));
const Signup = lazy(() => import('./Components/Auth/Signup'));
const Profile = lazy(() => import('./Components/Profile/Profile'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
  </div>
);

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
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes with Layout */}
          <Route path="/app" element={<Suspense fallback={<LoadingFallback />}><Layout /></Suspense>}>
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
      </Suspense>
    </BrowserRouter>
  );
}