import { useAppContext } from '../../context/app.context';
import { FaLightbulb } from 'react-icons/fa';
import QuizCard from '../QuizCard/Card';
import QuizFilter from './QuizFilter';
import ShimmerCard from '../../Layout/shimmerCardeUI';
import logo from '/logo.png';
import NotFound from '/NotFound.svg';

function Home() {
    const { quizzes, search, selectedField, isLoading, theme } = useAppContext();

    // Filter quizzes based on search and field
    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(search.toLowerCase());
        const matchesField = selectedField === 'All' || quiz.field === selectedField;
        return matchesSearch && matchesField;
    });

    return (
        <div className={`h-auto rounded-xl w-full  flex flex-col items-center ${theme === 'dark' ? 'bg-background-dark' : 'bg-background-light'}`}>
            <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-semibold  px-4 text-center">
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Find Your Quiz</span>
                <img src={logo} alt="Quiz Logo" className="h-16 hover:scale-110 transition-transform duration-300" />
                <FaLightbulb className={`text-xl ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500'}`} />
            </div>

            {/* Search Filter Component */}
            <QuizFilter />

            {/* Quiz Grid */}
            <div className="w-full px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        Array(6)
                            .fill()
                            .map((_, index) => <ShimmerCard key={index} />)
                    ) : filteredQuizzes.length > 0 ? (
                        filteredQuizzes.map(({ _id, title, field, numQuestions, timeLimit }) => (
                            <QuizCard
                                key={_id}
                                heading={title}
                                Field={field || "General"}
                                Questions={numQuestions}
                                Time={timeLimit}
                                link={`/quiz/test?id=${_id}&name=${encodeURIComponent(title)}&field=${encodeURIComponent(field || "General")}&questions=${numQuestions}&time=${timeLimit}`}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center col-span-full mt-20">
                            <img src={NotFound} alt="No quizzes found" className="max-w-md w-full" />
                            <p className={`text-lg mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                No quizzes match your search criteria
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
