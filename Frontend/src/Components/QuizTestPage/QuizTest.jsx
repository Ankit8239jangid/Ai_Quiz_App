import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/app.context';
import { useAuth } from '../../context/auth.context';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaClock, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';

function QuizTest() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const id = searchParams.get('id');
    const name = searchParams.get('name');

    const { Selectquizze, isLoading, FetchApi, theme } = useAppContext();
    const { isAuthenticated } = useAuth();

    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            FetchApi(id);
        }
    }, []);

    useEffect(() => {
        if (Selectquizze && Selectquizze.questions) {
            setUserAnswers(new Array(Selectquizze.questions.length).fill(''));
            setTimeLeft(Selectquizze.timeLimit * 60);
        }
    }, [Selectquizze]);

    useEffect(() => {
        if (!timeLeft || quizSubmitted) return;

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime === 1) {
                    clearInterval(timerId);
                    handleSubmitQuiz();
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, quizSubmitted]);

    const formatTime = useCallback((seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    const handleAnswerSelect = useCallback((questionIndex, option) => {
        if (quizSubmitted) return;

        setUserAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[questionIndex] = option;
            return newAnswers;
        });
    }, [quizSubmitted]);

    const handleSubmitQuiz = useCallback(async () => {
        if (quizSubmitted || submitting) return ;

        const unansweredQuestions = userAnswers.filter(answer => answer === '').length;
        if (unansweredQuestions > 0) {
            if (!window.confirm(`You have ${unansweredQuestions} unanswered questions. Are you sure you want to submit?`)) {
                return;
            }
        }

        setSubmitting(true);
        setError(null);

        try {
            if (isAuthenticated()) {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/progress/submit`,
                    {
                        quizId: id,
                        userAnswers
                    }
                );

                setQuizResult(response.data.result);
            } else {
                const questions = Selectquizze.questions;
                const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
                const score = (correctAnswers / questions.length) * 100;

                setQuizResult({
                    score,
                    totalQuestions: questions.length,
                    correctAnswers
                });
            }

            setQuizSubmitted(true);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setError('Failed to submit quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }, [quizSubmitted, submitting, userAnswers, isAuthenticated, id, Selectquizze]);

    return (
        <div className="min-h-screen flex flex-col overflow-auto items-center">
            <div className={`w-full max-w-4xl mx-auto p-6 sm:w-full ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'} transition-colors duration-300`}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold">{name || (Selectquizze && Selectquizze.title) || 'Quiz'}</h1>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className={`mt-4 p-8 flex justify-center items-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-blue-500 animate-spin mb-4"></div>
                            <p className="text-lg">Loading quiz details...</p>
                        </div>
                    </div>
                ) : Selectquizze ? (
                    <div className={`mt-4 p-6 rounded-xl shadow-lg w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-gray-200'}`}>
                        <div className="border-b pb-4 mb-4 border-opacity-20 border-gray-400">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-bold">{Selectquizze.title}</h2>
                                {!quizSubmitted && timeLeft > 0 && (
                                    <div className={`flex items-center px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                        <FaClock className="mr-2" />
                                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <p className={`text-sm px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                    Time: {Selectquizze.timeLimit} minutes
                                </p>
                                <p className={`text-sm px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                                    Questions: {Selectquizze.numQuestions}
                                </p>
                            </div>
                        </div>

                        {quizSubmitted && quizResult && (
                            <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/20 border border-green-800 text-green-300' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                                <h3 className="text-lg font-bold mb-2">Quiz Results</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm">Score</p>
                                        <p className="text-2xl font-bold">{Math.round(quizResult.score)}%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm">Correct Answers</p>
                                        <p className="text-2xl font-bold">{quizResult.correctAnswers} / {quizResult.totalQuestions}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm">Status</p>
                                        <p className="text-xl font-bold">
                                            {quizResult.score >= 70 ? (
                                                <span className="text-green-500">Passed</span>
                                            ) : (
                                                <span className="text-red-500">Failed</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">Questions:</h3>
                            <div className="space-y-6">
                                {Selectquizze.questions.map((q, qIndex) => (
                                    <div
                                        key={q._id || qIndex}
                                        className={`p-4 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                                    >
                                        <p className="text-lg font-medium mb-3">
                                            <span className={`inline-block w-6 h-6 text-center rounded-full mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>{qIndex + 1}</span>
                                            {q.question}
                                        </p>

                                        <div className="space-y-2 pl-4">
                                            {q.options.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                                        quizSubmitted
                                                            ? option === q.correctAnswer
                                                                ? `${theme === 'dark' ? 'bg-green-900/30 border border-green-700' : 'bg-green-100 border border-green-300'}`
                                                                : option === userAnswers[qIndex] && option !== q.correctAnswer
                                                                    ? `${theme === 'dark' ? 'bg-red-900/30 border border-red-700' : 'bg-red-100 border border-red-300'}`
                                                                    : `${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`
                                                            : userAnswers[qIndex] === option
                                                                ? `${theme === 'dark' ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-100 border border-blue-300'}`
                                                                : `${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`
                                                    }`}
                                                    onClick={() => handleAnswerSelect(qIndex, option)}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${userAnswers[qIndex] === option
                                                            ? (theme === 'dark' ? 'border-blue-400 bg-blue-900' : 'border-blue-500 bg-blue-100')
                                                            : (theme === 'dark' ? 'border-gray-500' : 'border-gray-400')}`}
                                                        >
                                                            {userAnswers[qIndex] === option && (
                                                                <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                                                            )}
                                                        </div>
                                                        <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>{option}</span>

                                                        {quizSubmitted && (
                                                            <span className="ml-auto">
                                                                {option === q.correctAnswer ? (
                                                                    <FaCheck className="text-green-500" />
                                                                ) : userAnswers[qIndex] === option && option !== q.correctAnswer ? (
                                                                    <FaTimes className="text-red-500" />
                                                                ) : null}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {!quizSubmitted && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={submitting}
                                    className={`px-6 py-3 rounded-lg font-medium text-white ${submitting
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : theme === 'dark'
                                            ? 'bg-primary-dark hover:bg-indigo-600'
                                            : 'bg-primary-light hover:bg-indigo-700'} transition-colors duration-300`}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                                </button>
                            </div>
                        )}

                        {quizSubmitted && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className={`px-6 py-3 rounded-lg font-medium mr-4 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition-colors duration-300`}
                                >
                                    Back to Dashboard
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className={`px-6 py-3 rounded-lg font-medium text-white ${theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} transition-colors duration-300`}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`mt-4 p-6 rounded-lg border ${theme === 'dark' ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-600'}`}>
                        <p className="text-center">No quiz found with this ID.</p>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} text-white transition-colors duration-300`}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizTest;