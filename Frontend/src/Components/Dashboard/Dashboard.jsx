import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { useAppContext } from '../../context/app.context';
import axios from 'axios';
import { FaChartBar, FaCheckCircle, FaClipboardList, FaPlus, FaHistory, FaRobot } from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [myQuizzes, setMyQuizzes] = useState([]);
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentUser, isAuthenticated } = useAuth();
    const { theme } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Fetch dashboard data
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch user stats
                const statsResponse = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/progress/stats/summary`
                );

                // Fetch user's quizzes
                const quizzesResponse = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/quiz/my-quizzes`
                );

                // Fetch user's progress
                const progressResponse = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/progress`
                );

                setStats(statsResponse.data.stats);
                setMyQuizzes(quizzesResponse.data.quizzes);
                setRecentAttempts(progressResponse.data.progress.slice(0, 5));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center p-6 max-w-md">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            Welcome back, {currentUser?.firstname || 'User'}!
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                        <button
                            onClick={() => navigate('/generate-quiz')}
                            className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors duration-300`}
                        >
                            <FaRobot className="mr-2" />
                            AI Generate Quiz
                        </button>
                        <button
                            onClick={() => navigate('/create-quiz')}
                            className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center ${theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} text-white transition-colors duration-300`}
                        >
                            <FaPlus className="mr-2" />
                            Create New Quiz
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                                <FaClipboardList className="text-xl" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold">Total Quizzes</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.totalQuizzes || 0}</p>
                    </div>

                    <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
                                <FaCheckCircle className="text-xl" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold">Completed</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.completedQuizzes || 0}</p>
                    </div>

                    <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                                <FaChartBar className="text-xl" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold">Avg. Score</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.averageScore ? `${Math.round(stats.averageScore)}%` : '0%'}</p>
                    </div>

                    <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600'}`}>
                                <FaHistory className="text-xl" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold">Best Score</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.highestScore ? `${Math.round(stats.highestScore)}%` : '0%'}</p>
                    </div>
                </div>

                {/* My Quizzes */}
                <div className={`p-6 rounded-lg shadow-md mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-xl font-bold mb-4">My Quizzes</h2>

                    {myQuizzes.length === 0 ? (
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className="text-center">You haven't created any quizzes yet.</p>
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => navigate('/create-quiz')}
                                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} text-white transition-colors duration-300`}
                                >
                                    Create Your First Quiz
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                                        <th className="text-left py-3 px-4">Title</th>
                                        <th className="text-left py-3 px-4">Field</th>
                                        <th className="text-left py-3 px-4">Questions</th>
                                        <th className="text-left py-3 px-4">Time Limit</th>
                                        <th className="text-left py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myQuizzes.map((quiz) => (
                                        <tr
                                            key={quiz._id}
                                            className={`hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-150`}
                                        >
                                            <td className="py-3 px-4">{quiz.title}</td>
                                            <td className="py-3 px-4">{quiz.field}</td>
                                            <td className="py-3 px-4">{quiz.numQuestions}</td>
                                            <td className="py-3 px-4">{quiz.timeLimit} min</td>
                                            <td className="py-3 px-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
                                                        className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-900 hover:bg-blue-800 text-blue-200' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/quiz/test?id=${quiz._id}&name=${encodeURIComponent(quiz.title)}`)}
                                                        className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-green-900 hover:bg-green-800 text-green-200' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Attempts */}
                <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-xl font-bold mb-4">Recent Quiz Attempts</h2>

                    {recentAttempts.length === 0 ? (
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className="text-center">You haven't attempted any quizzes yet.</p>
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => navigate('/quizes')}
                                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} text-white transition-colors duration-300`}
                                >
                                    Browse Quizzes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                                        <th className="text-left py-3 px-4">Quiz</th>
                                        <th className="text-left py-3 px-4">Field</th>
                                        <th className="text-left py-3 px-4">Score</th>
                                        <th className="text-left py-3 px-4">Date</th>
                                        <th className="text-left py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentAttempts.map((attempt) => (
                                        <tr
                                            key={attempt._id}
                                            className={`hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-150`}
                                        >
                                            <td className="py-3 px-4">{attempt.quizId?.title || 'Unknown Quiz'}</td>
                                            <td className="py-3 px-4">{attempt.quizId?.field || 'N/A'}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        attempt.score >= 70
                                                            ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                                            : attempt.score >= 40
                                                                ? theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                                                                : theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {Math.round(attempt.score)}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Date(attempt.attemptedAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => navigate(`/quiz/test?id=${attempt.quizId?._id}`)}
                                                    className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-purple-900 hover:bg-purple-800 text-purple-200' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
                                                >
                                                    Try Again
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
