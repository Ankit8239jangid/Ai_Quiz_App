import { useAppContext } from '../../context/app.context';
import QuizCard from '../QuizCard/Card';
import QuizFilter from './QuizFilter';
import ShimmerCard from '../../Layout/shimmerCardeUI';
import logo from '/logo.png';
import NotFound from '/NotFound.svg';

function Home() {
    const { quizzes, search, selectedField, isLoading } = useAppContext();

    // Filter quizzes based on search and field
    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(search.toLowerCase());
        const matchesField = selectedField === 'All' || quiz.field === selectedField;
        return matchesSearch && matchesField;
    });

    return (
        <div className="max-h-screen w-full overflow-auto flex flex-col items-center">
            <div className="flex items-center justify-center text-2xl md:text-3xl font-semibold pt-4 px-4 text-center">
                <span>Find Your Quiz</span>
                <img src={logo} alt="" className="h-16" />
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
                        <div className="flex justify-center w-full mt-10">
                            <img src={NotFound} alt="No quizzes found" className="h-64" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
