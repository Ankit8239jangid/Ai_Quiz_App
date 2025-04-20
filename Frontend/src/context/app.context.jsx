import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

// Create a custom axios instance with caching
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Simple in-memory cache
const cache = {
    data: new Map(),
    timestamp: new Map(),
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

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

    // Function to fetch all quizzes from the backend with caching
    const fetchAllQuizzes = useCallback(async (forceRefresh = false) => {
        const cacheKey = 'all_quizzes';
        const now = new Date();

        try {
            // Check if we have valid cached data
            if (!forceRefresh &&
                cache.data.has(cacheKey) &&
                cache.timestamp.has(cacheKey) &&
                (now - cache.timestamp.get(cacheKey)) < CACHE_DURATION) {

                // Use cached data
                setQuizzes(cache.data.get(cacheKey));
                return;
            }

            setIsLoading(true);

            const response = await api.get('/quiz/all_quiz');

            // Sort quizzes by creation date (newest first)
            const sortedQuizzes = response.data.quizzes.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            // Update cache
            cache.data.set(cacheKey, sortedQuizzes);
            cache.timestamp.set(cacheKey, now.getTime());

            setQuizzes(sortedQuizzes);

        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch quizzes on initial load
    useEffect(() => {
        fetchAllQuizzes();
    }, [fetchAllQuizzes]); // Include fetchAllQuizzes in the dependency array

    // Fetch a single quiz by ID with caching
    const FetchApi = useCallback((id) => {
        (async () => {
            const cacheKey = `quiz_${id}`;
            const now = new Date();

            try {
                // Check if we have valid cached data for this quiz
                if (cache.data.has(cacheKey) &&
                    cache.timestamp.has(cacheKey) &&
                    (now - cache.timestamp.get(cacheKey)) < CACHE_DURATION) {

                    setSelectQuizze(cache.data.get(cacheKey));
                    return;
                }

                setIsLoading(true);
                const response = await api.get(`/quiz/${id}`);

                // Update cache
                cache.data.set(cacheKey, response.data.quiz);
                cache.timestamp.set(cacheKey, now.getTime());

                setSelectQuizze(response.data.quiz);

            } catch (error) {
                console.error("Error fetching quiz:", error);
                setSelectQuizze(null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [])

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




    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
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
        commonFields,
        setCommonFields,
        fetchAllQuizzes // Add the optimized fetch function
    }), [
        isSidebarOpen,
        isLoading,
        search,
        selectedField,
        quizzes,
        score,
        userAnswers,
        FetchApi,
        Selectquizze,
        theme,
        commonFields,
        fetchAllQuizzes
    ]);

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
