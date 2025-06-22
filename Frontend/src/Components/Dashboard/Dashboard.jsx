import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { useAppContext } from '../../context/app.context';
import { useDashboard } from '../../context/dashboard.context';
import { FaChartBar, FaCheckCircle, FaClipboardList, FaPlus, FaHistory, FaTrash, FaSync, FaRobot, FaSpinner } from 'react-icons/fa';
import DashboardShimmer from './Loding';


const Dashboard = () => {
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, quizId: null, quizTitle: '' });
    const [refreshing, setRefreshing] = useState(false);
    const [Loding, setLoding] = useState(false)
    const { currentUser, isAuthenticated } = useAuth();
    const { theme } = useAppContext();
    const {
        stats,
        myQuizzes,
        recentAttempts,
        loading,
        error,
        lastFetched,
        fetchDashboardData,
        deleteQuiz
    } = useDashboard();
    const navigate = useNavigate();

    // Add a refresh function
    const handleRefresh = () => {
        setRefreshing(true);
        fetchDashboardData(true).finally(() => {
            setRefreshing(false);
        });
    };

    // Show delete confirmation dialog
    const showDeleteConfirmation = (quizId, quizTitle) => {
        setDeleteConfirmation({ show: true, quizId, quizTitle });
    };

    // Hide delete confirmation dialog
    const hideDeleteConfirmation = () => {
        setDeleteConfirmation({ show: false, quizId: null, quizTitle: '' });
    };

    // Handle quiz deletion
    const handleDeleteQuiz = async () => {
        setLoding(true)
        const success = await deleteQuiz(deleteConfirmation.quizId);
        if (success) {
            hideDeleteConfirmation();
            setLoding(false)
        }
    };

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated()) {
            navigate('/');
            return;
        }
        // Fetch dashboard data only once when component mounts
        fetchDashboardData();
    }, [isAuthenticated, navigate, fetchDashboardData]);

    if (loading) {
        return (
            <DashboardShimmer />
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center p-6 max-w-md w-full">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-indigo-700 w-full"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen  p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between gap-5 items-start md:items-center mb-8 w-full">
                    <div className=" w-full md:w-auto">
                        <div className='flex items-center'>
                            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className={`ml-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${refreshing ? 'animate-spin' : ''}`}
                                title="Refresh dashboard"
                            >
                                <FaSync className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                            </button>
                        </div>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} w-full`}>
                            Welcome back, {currentUser?.firstname || 'User'}!
                        </p>

                    </div>
                    <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-end md:gap-4">
                        <button
                            onClick={() => navigate('/app/generate-quiz')}
                            className={`px-4 py-2 rounded-lg flex items-center justify-center text-center ${theme === 'dark'
                                ? 'bg-primary-dark hover:bg-indigo-600'
                                : 'bg-primary-light hover:bg-indigo-700'
                                } text-white transition-colors duration-300 w-full md:w-auto`}
                        >
                            <FaRobot className="mr-2" />
                            Create Quiz by Ai
                        </button>
                        <button
                            onClick={() => navigate('/app/create-quiz')}
                            className={`px-4 py-2 rounded-lg flex items-center justify-center text-center ${theme === 'dark'
                                ? 'bg-primary-dark hover:bg-indigo-600'
                                : 'bg-primary-light hover:bg-indigo-700'
                                } text-white transition-colors duration-300 w-full md:w-auto`}
                        >
                            <FaPlus className="mr-2" />
                            Create New Quiz
                        </button>
                    </div>

                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`p-6 rounded-lg hover:scale-105 transition-all ease-out shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full`}>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                                <FaClipboardList className="text-xl" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold">Total Quizzes</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.totalQuizzes || 0}</p>
                    </div>

                    <div className={`p-6 rounded-lg hover:scale-105 transition-all shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full`}>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
                                <FaCheckCircle className="text-xl" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold">Completed</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.completedQuizzes || 0}</p>
                    </div>

                    <div className={`p-6 rounded-lg hover:scale-105 transition-all ease-out shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full`}>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                                <FaChartBar className="text-xl" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold">Avg. Score</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.averageScore ? `${Math.round(stats.averageScore)}%` : '0%'}</p>
                    </div>

                    <div className={`p-6 rounded-lg hover:scale-105 transition-all ease-out shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full`}>
                        <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600'}`}>
                                <FaHistory className="text-xl" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold">Best Score</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.highestScore ? `${Math.round(stats.highestScore)}%` : '0%'}</p>
                    </div>
                </div>


                {/* Recent Attempts */}
                <div className={`p-6 rounded-lg  ease-out shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full`}>
                    <h2 className="text-xl font-bold mb-4">Recent Quiz Attempts</h2>

                    {recentAttempts.length === 0 ? (
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} w-full`}>
                            <p className="text-center">You haven't attempted any quizzes yet.</p>
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => navigate('/app/quizzes')}
                                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} text-white transition-colors duration-300 w-full`}
                                >
                                    Browse Quizzes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
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
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${attempt.score >= 70
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
                                                    onClick={() => navigate(`/app/quiz/test?id=${attempt.quizId?._id}`)}
                                                    className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-purple-900 hover:bg-purple-800 text-purple-200' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'} w-full`}
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

                {/* My Quizzes */}
                <div className={`p-6 rounded-lg  ease-out shadow-md mb-8 mt-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full`}>
                    <h2 className="text-xl font-bold mb-4">My Quizzes</h2>

                    {myQuizzes.length === 0 ? (
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} w-full`}>
                            <p className="text-center">You haven't created any quizzes yet.</p>
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => navigate('/app/create-quiz')}
                                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} text-white transition-colors duration-300 w-full`}
                                >
                                    Create Your First Quiz
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
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
                                                <div className="flex space-x-2 items-center justify-center">
                                                    <button
                                                        onClick={() => navigate(`/app/edit-quiz/${quiz._id}`)}
                                                        className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-900 hover:bg-blue-800 text-blue-200' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'} w-full`}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/app/quiz/test?id=${quiz._id}&name=${encodeURIComponent(quiz.title)}`)}
                                                        className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-green-900 hover:bg-green-800 text-green-200' : 'bg-green-100 hover:bg-green-200 text-green-700'} w-full`}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => showDeleteConfirmation(quiz._id, quiz.title)}
                                                        className={`px-3  flex items-center justify-center py-2 rounded ${theme === 'dark' ? 'bg-red-900 hover:bg-red-800 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'} w-full`}
                                                    >
                                                        <FaTrash />
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

                {/* Delete Confirmation Modal */}
                {deleteConfirmation.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className={`p-6 rounded-lg hover:scale-105 transition-all ease-out ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}>
                            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                            <p>Are you sure you want to delete <strong>{deleteConfirmation.quizTitle}</strong>?</p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={hideDeleteConfirmation}
                                    className={` px-4 py-2 rounded active:scale-50 transition-all  ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} w-full`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteQuiz}
                                    className={` px-4 py-2 rounded text-center  active:scale-50 transition-all  ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white w-full`}
                                >
                                    {Loding ? <FaSpinner className="animate-spin ml-20" /> : 'Delete'}
                                </button>


                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default Dashboard;
