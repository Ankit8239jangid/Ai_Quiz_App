import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { useAppContext } from '../../context/app.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaTimes, FaSave, FaArrowLeft, FaTrash, FaRobot } from 'react-icons/fa';
import GeneratedResponse from './GeneratedResponse';

const QuizForm = () => {
    const { id } = useParams(); // For editing existing quiz
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        field: '',
        timeLimit: 10,
        questions: [
            {
                question: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            }
        ]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { isAuthenticated } = useAuth();
    const { theme } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        // If in edit mode, fetch the quiz data
        if (isEditMode) {
            const fetchQuiz = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/quiz/with-answers/${id}`
                    );

                    const quiz = response.data.quiz;
                    setFormData({
                        title: quiz.title,
                        field: quiz.field,
                        timeLimit: quiz.timeLimit,
                        questions: quiz.questions.map(q => ({
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.correctAnswer
                        }))
                    });

                } catch (error) {
                    console.error('Error fetching quiz:', error);
                    setError('Failed to load quiz data. You may not have permission to edit this quiz.');
                } finally {
                    setLoading(false);
                }
            };

            fetchQuiz();
        }
    }, [id, isEditMode, isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index][field] = value;
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const handleCorrectAnswerChange = (questionIndex, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].correctAnswer = value;
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: ''
                }
            ]
        });
    };

    const removeQuestion = (index) => {
        if (formData.questions.length <= 1) {
            setError('Quiz must have at least one question');
            return;
        }

        const updatedQuestions = [...formData.questions];
        updatedQuestions.splice(index, 1);
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const addOption = (questionIndex) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].options.push('');
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const removeOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...formData.questions];
        const question = updatedQuestions[questionIndex];

        if (question.options.length <= 2) {
            setError('Each question must have at least 2 options');
            return;
        }

        // If removing the correct answer, reset it
        if (question.options[optionIndex] === question.correctAnswer) {
            question.correctAnswer = '';
        }

        question.options.splice(optionIndex, 1);
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const validateForm = () => {
        // Check title
        if (!formData.title.trim()) {
            setError('Quiz title is required');
            return false;
        }

        // Check field
        if (!formData.field.trim()) {
            setError('Quiz field is required');
            return false;
        }

        // Check time limit
        if (formData.timeLimit < 1) {
            setError('Time limit must be at least 1 minute');
            return false;
        }

        // Check questions
        for (let i = 0; i < formData.questions.length; i++) {
            const question = formData.questions[i];

            if (!question.question.trim()) {
                setError(`Question ${i + 1} text is required`);
                return false;
            }

            // Check options
            for (let j = 0; j < question.options.length; j++) {
                if (!question.options[j].trim()) {
                    setError(`Option ${j + 1} for Question ${i + 1} is required`);
                    return false;
                }
            }

            // Check correct answer
            if (!question.correctAnswer) {
                setError(`Correct answer for Question ${i + 1} is required`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Prepare data
            const quizData = {
                ...formData,
                numQuestions: formData.questions.length
            };

            if (isEditMode) {
                // Update existing quiz
                await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/quiz/update/${id}`,
                    quizData
                );

                setSuccess('Quiz updated successfully!');
                toast.success('Quiz updated successfully!');
            } else {
                // Create new quiz
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/quiz/create_quiz`,
                    quizData
                );

                setSuccess('Quiz created successfully!');
                toast.success('Quiz created successfully!');
            }

            // Redirect after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error saving quiz:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save quiz. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full p-2 sm:p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex items-center mb-4 sm:mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className={`mr-2 sm:mr-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'} transition-colors duration-300`}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold">{isEditMode ? 'Edit Quiz' : 'Create New Quiz'}</h1>
                </div>

                {error && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-red-100 text-red-700 border border-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-green-100 text-green-700 border border-green-200">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
                    <div className={`p-4 sm:p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quiz Details</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                            <div>
                                <label
                                    htmlFor="title"
                                    className={`block mb-1 sm:mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                                >
                                    Quiz Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                                    placeholder="Enter quiz title"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="field"
                                    className={`block mb-1 sm:mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                                >
                                    Field/Category
                                </label>
                                <input
                                    type="text"
                                    id="field"
                                    name="field"
                                    value={formData.field}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                                    placeholder="e.g. Science, History, Programming"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="timeLimit"
                                className={`block mb-1 sm:mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                            >
                                Time Limit (minutes)
                            </label>
                            <input
                                type="number"
                                id="timeLimit"
                                name="timeLimit"
                                value={formData.timeLimit}
                                onChange={handleChange}
                                min="1"
                                className={`w-full sm:w-1/4 px-3 sm:px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                            />
                        </div>
                    </div>

                    <div className={`p-4 sm:p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">Questions</h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className={`px-3 sm:px-4 py-2 rounded-lg flex items-center text-sm sm:text-base ${theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} text-white transition-colors duration-300`}
                            >
                                <FaPlus className="mr-1 sm:mr-2" />
                                Add Question
                            </button>
                        </div>

                        {formData.questions.map((question, questionIndex) => (
                            <div
                                key={questionIndex}
                                className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                            >
                                <div className="flex justify-between items-center mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold">Question {questionIndex + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(questionIndex)}
                                        className={`p-2 rounded-full ${theme === 'dark' ? 'bg-red-900 hover:bg-red-800 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'} transition-colors duration-300`}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="mb-3 sm:mb-4">
                                    <label
                                        htmlFor={`question-${questionIndex}`}
                                        className={`block mb-1 sm:mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                                    >
                                        Question Text
                                    </label>
                                    <input
                                        type="text"
                                        id={`question-${questionIndex}`}
                                        value={question.question}
                                        onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                                        className={`w-full px-3 sm:px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                                        placeholder="Enter question"
                                    />
                                </div>

                                <div className="mb-3 sm:mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Options
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => addOption(questionIndex)}
                                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm flex items-center ${theme === 'dark' ? 'bg-green-900 hover:bg-green-800 text-green-200' : 'bg-green-100 hover:bg-green-200 text-green-700'} transition-colors duration-300`}
                                        >
                                            <FaPlus className="mr-1" />
                                            Add Option
                                        </button>
                                    </div>

                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center mb-2 w-full overflow-hidden">
                                            <input
                                                type="radio"
                                                id={`correct-${questionIndex}-${optionIndex}`}
                                                name={`correct-${questionIndex}`}
                                                checked={option === question.correctAnswer}
                                                onChange={() => handleCorrectAnswerChange(questionIndex, option)}
                                                className="mr-2"
                                            />
                                            <div className="flex-1 min-w-0 mr-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                                    className={`w-full px-3 sm:px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeOption(questionIndex, optionIndex)}
                                                className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors duration-300`}
                                            >
                                                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    <p className={`text-xs sm:text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Select the radio button next to the correct answer
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Show Generated Response for edit mode */}
                    {isEditMode && (
                        <GeneratedResponse />
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg mr-2 sm:mr-4 text-sm sm:text-base ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center text-sm sm:text-base ${loading ? 'bg-gray-500 cursor-not-allowed' : theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} text-white transition-colors duration-300`}
                        >
                            <FaSave className="mr-1 sm:mr-2" />
                            {loading ? 'Saving...' : isEditMode ? 'Update Quiz' : 'Create Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizForm;
