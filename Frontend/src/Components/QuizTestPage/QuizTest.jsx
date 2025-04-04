import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../../context/app.context';

function QuizTest() {
    const [searchParams] = useSearchParams();

    // Extract ID and Name from params
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const { Selectquizze, setSelectQuizze, isLoading, setIsLoading } = useAppContext();
    // Local state for loading & quiz data
    // const [quiz, setQuiz] = useState(null);
    // const [isLoading, setIsLoading] = useState(false); // ✅ FIXED: Using local state

    useEffect(() => {
        if (!id) return; // Prevent API call if `id` is null

        (async () => {
            try {
                setIsLoading(true); // ✅ No longer using context
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${id}`);

                setSelectQuizze(response.data.quiz); // ✅ Correctly set quiz data
            } catch (error) {
                console.error("Error fetching quiz:", error);
                setSelectQuizze(null);
            } finally {
                setIsLoading(false); // ✅ Works correctly now
            }
        })();
    }, [id]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            <p className="text-lg">Name: {name}</p>

            {isLoading ? (
                <p className="mt-4 text-blue-400">Loading quiz details...</p>
            ) : Selectquizze ? (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg w-3/4">
                    <h2 className="text-2xl font-semibold">{Selectquizze.title}</h2>
                    <p className="text-lg">Time Limit: {Selectquizze.timeLimit} minutes</p>
                    <p className="text-lg">Total Questions: {Selectquizze.numQuestions}</p>

                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">Questions:</h3>
                        {Selectquizze.questions.map((q) => (
                            <div key={q._id} className="mt-3 p-3 bg-gray-700 rounded-lg">
                                <p className="text-lg font-medium">{q.question}</p>
                                <ul className="mt-2">
                                    {q.options.map((option, index) => (
                                        <li key={index} className="text-gray-300">• {option}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-red-500">No quiz found with this ID.</p>
            )}
        </div>
    );
}

export default QuizTest;
