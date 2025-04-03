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
                <img src={logo} alt="" className='h-16' />
            </div>

            {/* search Filter comonent */}
            <QuizFilter />

            {/* Quiz Grid */}
            <div className="w-full max-w- px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? Array(6).fill().map((_, index) => <ShimmerCard key={index} />) 
                    : filteredQuizzes.length > 0 ? (
                        filteredQuizzes.map(({ _id, title, field, numQuestions, timeLimit }) => (
                            <QuizCard
                                key={_id}
                                heading={title}
                                Field={field || "General"}
                                Questions={numQuestions}
                                Time={timeLimit}
                                link={`/quiz/id=${_id}?name=${title}&field=${field || "General"}&questions=${numQuestions}&time=${timeLimit}`}
                            />
                        ))
                    ) : (


                        <img src={NotFound} alt="" className=' md:translate-x-72 translate-y-20' />

                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
