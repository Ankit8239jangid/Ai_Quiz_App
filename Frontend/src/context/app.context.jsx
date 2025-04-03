import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    // Add your state management here
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedField, setSelectedField] = useState('All');
    const [quizzes, setQuizzes] = useState([]);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);


    // Fetch quizzes from the backend
    const fetchData = async () => {
        try {
            setIsLoading(true); // Set loading state
            const response = await axios.get('http://localhost:3000/api/v1/quiz');
            setQuizzes(response.data.quizzes);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    useEffect(() => {
        fetchData();
    }, []);








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