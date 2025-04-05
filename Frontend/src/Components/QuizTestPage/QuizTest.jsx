import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/app.context';
import { useEffect } from 'react';

function QuizTest() {
    const [searchParams] = useSearchParams();

    // Extract ID and Name from params
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const { Selectquizze, isLoading, FetchApi, theme } = useAppContext();

    useEffect(() => {
        if (id) {
            FetchApi(id);
        }
    }, [])  

    return (
        <div className="min-h-screen flex flex-col overflow-auto items-center">

            <div className={`w-full max-w-4xl mx-auto p-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <h1 className="text-2xl font-bold mb-4">{name}</h1>

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
                            <h2 className="text-2xl font-bold mb-2">{Selectquizze.title}</h2>
                            <div className="flex flex-wrap gap-4">
                                <p className={`text-sm px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                    Time: {Selectquizze.timeLimit} minutes
                                </p>
                                <p className={`text-sm px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                                    Questions: {Selectquizze.numQuestions}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">Questions:</h3>
                            <div className="space-y-4">
                                {Selectquizze.questions.map((q, qIndex) => (
                                    <div key={q._id} className={`p-4 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                        <p className="text-lg font-medium mb-3">
                                            <span className={`inline-block w-6 h-6 text-center rounded-full mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>{qIndex + 1}</span>
                                            {q.question}
                                        </p>
                                        <ul className="space-y-2 pl-8">
                                            {q.options.map((option, index) => (
                                                <li key={index} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                                                    <span className="mr-2">•</span> {option}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`mt-4 p-6 rounded-lg border ${theme === 'dark' ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-600'}`}>
                        <p className="text-center">No quiz found with this ID.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizTest;
