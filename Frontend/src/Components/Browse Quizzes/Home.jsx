import { useAppContext } from '../../context/app.context';
import { FaLightbulb, FaSearch } from 'react-icons/fa';
import QuizCard from '../QuizCard/Card';
import QuizFilter from './QuizFilter';
import ShimmerCard from '../../Layout/shimmerCardeUI';
import logo from '/logo.png';
import NotFound from '/NotFound.svg';
import { useAuth } from '../../context/auth.context';


function Home() {

    const { quizzes, search, selectedField, isLoading, theme } = useAppContext();
   
    // Filter quizzes based on search and field
    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(search.toLowerCase());
        const matchesField = selectedField === 'All' || quiz.field === selectedField;
        return matchesSearch && matchesField;
    });


 
    return (
        <div className={`min-h-screen p-4  ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-row items-center   justify-center  gap-5 mb-8">
                    <div className="flex items-center justify-center mb-4 md:mb-0 ">
                        <img src={logo} alt="Quiz Logo" className="h-12 md:h-16  hover:scale-110 transition-transform duration-300" />
                        <h1 className="text-3xl md:text-4xl font-bold">Find Your Quiz</h1>
                    </div>
                    <FaLightbulb className={`text-2xl md:text-3xl ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500'}`} />
                </header>

                <QuizFilter />

                <main className="mt-8">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill().map((_, index) => <ShimmerCard key={index} />)}
                        </div>
                    ) : filteredQuizzes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredQuizzes.map(({ _id, title, field, numQuestions, timeLimit }) => (
                                <QuizCard
                                    key={_id}
                                    heading={title}
                                    Field={field || "General"}
                                    Questions={numQuestions}
                                    Time={timeLimit}
                                    link={`/app/quiz/test?id=${_id}&name=${encodeURIComponent(title)}&field=${encodeURIComponent(field || "General")}&questions=${numQuestions}&time=${timeLimit}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-20">
                            <img src={NotFound} alt="No quizzes found" className="max-w-md w-full mb-8" />
                            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                No quizzes match your search criteria
                            </p>
                            <button className={`mt-4 px-6 py-2 rounded-full ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-300`}>
                                <FaSearch className="inline mr-2" />
                                Try a different search
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Home;
