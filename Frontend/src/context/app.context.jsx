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
    const [commonFields, setCommonFields] = useState([]);



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

    // State to track last refresh time
    const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

    // Function to fetch all quizzes from the backend
    const fetchAllQuizzes = async (forceRefresh = false) => {
        try {
            // Check if we need to refresh based on time (5 minutes cache)
            const now = new Date();
            const cacheTime = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (!forceRefresh && lastRefreshTime && (now - lastRefreshTime < cacheTime)) {
             
                return; // Use cached data
            }

            setIsLoading(true);
           

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quiz/all_quiz`);

            // Sort quizzes by creation date (newest first)
            const sortedQuizzes = response.data.quizzes.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setQuizzes(sortedQuizzes);
            setLastRefreshTime(new Date());
            console.log('Quiz data refreshed at:', new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch quizzes on initial load and when route changes
    useEffect(() => {
        fetchAllQuizzes();

        // This will run when the component unmounts
        return () => {
            console.log('Cleaning up quiz data fetch');
        };
    }, [window.location.pathname]);

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

    // Fetch common fields from the backend
    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quiz/fields`);
                setCommonFields(response.data.fields);
            } catch (error) {
                console.error('Error fetching fields:', error);
                toast.error('Failed to load quiz fields');
            }
        })();
    }, []);




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
        fetchAllQuizzes,  // Expose the refresh function
        lastRefreshTime,  // Expose the last refresh time
        setSelectQuizze,
        setIsLoading,
        theme,
        toggleTheme,
        commonFields,
        setCommonFields

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
