import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// We need auth for the token, but we'll get it from localStorage directly
import { useAppContext } from '../../context/app.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaRobot, FaSpinner, FaArrowLeft, FaLightbulb, FaCheck } from 'react-icons/fa';

const AIQuizGenerator = () => {
    const [prompt, setPrompt] = useState('Create a quiz about');
    const [field, setField] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState(null);

    const { theme, commonFields } = useAppContext();
    const navigate = useNavigate();

    // Check if user is authenticated by checking for token
    const isAuthenticated = () => !!localStorage.getItem('token');
    

    const examplePrompts = [
        'Create a quiz about the solar system and planets',
        'Generate questions about famous historical figures from the 20th century',
        'Make a quiz about popular programming languages and their features',
        'Create questions about world capitals and geography',
        'Generate a quiz about classic literature and famous authors'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prompt.trim()) {
            toast.error('Please enter a prompt for the quiz');
            return;
        }
        if (!numQuestions || isNaN(numQuestions) || numQuestions < 1 || numQuestions > 20) {
            toast.error('Please enter a valid number of questions between 1 and 20');
            return;
        }


        try {
            setLoading(true);

            if (!isAuthenticated()) {
                toast.error('You must be logged in to generate quizzes');
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/quiz/generate-ai-quiz`,
                {
                    prompt,
                    field,
                    numQuestions: numQuestions
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                const quiz = response.data.quiz;
                if (quiz.questions.length !== numQuestions) {
                    quiz.questions = quiz.questions.slice(0, numQuestions);
                    quiz.numQuestions = numQuestions;
                }
                setGeneratedQuiz(quiz);
                toast.success('Quiz generated successfully!');
            } else {
                toast.error('Failed to generate quiz');
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            toast.error('Rate limit exceeded: free-models-per-day' || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };



    const handleTryAgain = () => {
        setGeneratedQuiz(null);
    };

    const handleChange = (e) => {
        const value = e.target.value;

        if (value === '') {
            setNumQuestions('');
            return;
        }

        const num = parseInt(value);
        if (!isNaN(num) && num >= 1 && num <= 20) {
            setNumQuestions(num);
        }
    };


    const handleExamplePrompt = (examplePrompt) => {
        setPrompt(examplePrompt);
    };

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'} transition-colors duration-300`}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-3xl font-bold flex items-center">
                        <FaRobot className="mr-3 text-blue-500" />
                        AI Quiz Generator
                    </h1>
                </div>

                <div className={`p-6 rounded-lg shadow-md mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    {!generatedQuiz ? (
                        <>
                            <p className="mb-6">
                                Describe the quiz you want to create, and our AI will generate it for you. Be specific about the topic and the type of questions you want.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="prompt" className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Prompt
                                    </label>
                                    <textarea
                                        id="prompt"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Describe the quiz you want to generate..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="field" className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Field/Category
                                        </label>
                                        <select
                                            id="field"
                                            value={field}
                                            onChange={(e) => setField(e.target.value)}
                                            className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}

                                        >
                                            <option value="" disabled>Select a field</option>
                                            {commonFields && commonFields.length > 0 ? (
                                                commonFields.map((f) => (
                                                    <option key={f} value={f}>{f}</option>
                                                ))
                                            ) : (
                                                <option disabled>No fields available</option>
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="numQuestions"
                                            className={`mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                                }`}
                                        >
                                            Number of Questions
                                        </label>
                                        <input
                                            type="number"
                                            id="numQuestions"
                                            value={numQuestions}
                                            onChange={handleChange}
                                            min={1}
                                            max={20}
                                            placeholder="Enter number between 1 and 20"
                                            className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-800'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    disabled={loading | prompt.length < 24 }
                                    className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-300`}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Generating Quiz...
                                        </>
                                    ) : (
                                        <>
                                            <FaRobot className="mr-2" />
                                            Generate Quiz
                                            
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8">
                                <h3 className={`text-lg font-medium mb-3 flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                    <FaLightbulb className="mr-2 text-yellow-500" />
                                    Example Prompts
                                </h3>
                                <div className="space-y-2">
                                    {examplePrompts.map((examplePrompt, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleExamplePrompt(examplePrompt)}
                                            className={`p-3 rounded-lg cursor-pointer ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-200`}
                                        >
                                            {examplePrompt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                                <FaCheck className={`text-2xl ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                            </div>

                            <h2 className="text-2xl font-bold mb-2">Quiz Generated Successfully!</h2>
                            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Your quiz "{generatedQuiz.title}" has been created with {generatedQuiz.numQuestions} questions.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => navigate('/app/quizzes')}
                                    className="px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                                >
                                    View Generated Quiz
                                </button>
                                <button
                                    onClick={handleTryAgain}
                                    className={`px-6 py-3 rounded-lg font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition-colors duration-300`}
                                >
                                    Generate Another Quiz
                                </button>
                            </div>

                            <div className={`mt-8 p-4 rounded-lg text-left ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <h3 className="font-bold mb-2">Quiz Details:</h3>
                                <p><strong>Title:</strong> {generatedQuiz.title}</p>
                                <p><strong>Field:</strong> {generatedQuiz.field}</p>
                                <p><strong>Questions:</strong> {generatedQuiz.numQuestions}</p>
                                <p><strong>Time Limit:</strong> {generatedQuiz.timeLimit} minutes</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIQuizGenerator;
