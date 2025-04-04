import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    // State management
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedField, setSelectedField] = useState('All');
    const [quizzes, setQuizzes] = useState([]);
    const [Selectquizze, setSelectQuizze] = useState(null);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);

    // Fetch all quizzes from the backend
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/all_quiz`);
                setQuizzes(response.data.quizzes);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // Fetch a single quiz by ID

    const FetchApi = (id) => {
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
    }



    // Values to be shared across components
    const value = {
        isSidebarOpen,
        isLoading,
        search,
        setSearch,
        selectedField,
        setSelectedField,
        setIsSidebarOpen,
        quizzes,
        setQuizzes,
        score,
        setScore,
        userAnswers,
        setUserAnswers,
        FetchApi,
        Selectquizze,
        setSelectQuizze,
        setIsLoading,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
