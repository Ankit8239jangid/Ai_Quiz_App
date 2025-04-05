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

    // Theme state management
    const [theme, setTheme] = useState(() => {
        // Check if theme preference exists in localStorage
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light'; // Default to light mode if no preference
    });

    // Effect to apply theme class to document and save preference
    useEffect(() => {
        localStorage.setItem('theme', theme);

        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Fetch all quizzes from the backend
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quiz/all_quiz`);
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
                setIsLoading(true); 
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quiz/${id}`);

                setSelectQuizze(response.data.quiz); 
            } catch (error) {
                console.error("Error fetching quiz:", error);
                setSelectQuizze(null);
            } finally {
                setIsLoading(false); 
            }
        })();
    }




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
        theme,
        toggleTheme,
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
