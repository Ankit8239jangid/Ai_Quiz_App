import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create the context
const DashboardContext = createContext();

// Simple in-memory cache
const dashboardCache = {
    data: {
        stats: null,
        myQuizzes: [],
        recentAttempts: []
    },
    lastFetched: null
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Create a provider component
export const DashboardProvider = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [myQuizzes, setMyQuizzes] = useState([]);
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    // Function to fetch dashboard data with caching
    const fetchDashboardData = useCallback(async (forceRefresh = false) => {
        const now = new Date();

        // Use cached data if available and not forcing refresh
        if (!forceRefresh &&
            dashboardCache.lastFetched &&
            (now - dashboardCache.lastFetched < CACHE_DURATION) &&
            dashboardCache.data.stats) {

         

            setStats(dashboardCache.data.stats);
            setMyQuizzes(dashboardCache.data.myQuizzes);
            setRecentAttempts(dashboardCache.data.recentAttempts);
            setLastFetched(dashboardCache.lastFetched);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Set up headers with token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Make parallel requests for better performance
            const [statsResponse, quizzesResponse, progressResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/progress/stats/summary`, config),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/quiz/my-quizzes`, config),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/progress`, config)
            ]);

            // Sort quizzes by creation date (newest first)
            const sortedQuizzes = quizzesResponse.data.quizzes.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            // Update state
            setStats(statsResponse.data.stats);
            setMyQuizzes(sortedQuizzes);
            setRecentAttempts(progressResponse.data.progress.slice(0, 5));

            // Update cache
            dashboardCache.data.stats = statsResponse.data.stats;
            dashboardCache.data.myQuizzes = sortedQuizzes;
            dashboardCache.data.recentAttempts = progressResponse.data.progress.slice(0, 5);
            dashboardCache.lastFetched = now.getTime();

            setLastFetched(now);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
            toast.error(error.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to delete a quiz
    const deleteQuiz = useCallback(async (quizId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return false;
            }

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/quiz/delete/${quizId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                // Update local state
                setMyQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));

                // Update cache
                dashboardCache.data.myQuizzes = dashboardCache.data.myQuizzes.filter(
                    quiz => quiz._id !== quizId
                );

                toast.success('Quiz deleted successfully');
                return true;
            } else {
                toast.error('Failed to delete quiz');
                return false;
            }
        } catch (error) {
            console.error('Error deleting quiz:', error);
            toast.error(error.response?.data?.message || 'Failed to delete quiz');
            return false;
        }
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const value = React.useMemo(() => ({
        stats,
        myQuizzes,
        recentAttempts,
        loading,
        error,
        lastFetched,
        fetchDashboardData,
        deleteQuiz
    }), [
        stats,
        myQuizzes,
        recentAttempts,
        loading,
        error,
        lastFetched,
        fetchDashboardData,
        deleteQuiz
    ]);

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

// Custom hook to use the dashboard context
export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};
