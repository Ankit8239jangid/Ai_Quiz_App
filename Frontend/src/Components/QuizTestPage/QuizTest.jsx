import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/app.context';
import { useEffect } from 'react';

function QuizTest() {
    const [searchParams] = useSearchParams();

    // Extract ID and Name from params
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const { Selectquizze, isLoading, FetchApi } = useAppContext();

    useEffect(() => {
        if (id) {
            FetchApi(id); // Fetch quiz details using the ID
        }
    }, [])  //this Is an iffy function that takes a input of ID

    return (
        <div className="h-screen flex flex-col overflow-auto items-center text-white">

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
