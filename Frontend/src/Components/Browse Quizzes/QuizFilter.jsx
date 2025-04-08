import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../context/app.context';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { TbRefresh } from 'react-icons/tb';
import { useLocation } from 'react-router-dom';

function QuizFilter() {
    const { quizzes = [], search = '', setSearch, selectedField = 'All', setSelectedField, theme, fetchAllQuizzes, isLoading } = useAppContext();

    const [refreshing, setRefreshing] = useState(false);
    const location = useLocation();

    // Refresh data when component mounts or route changes
    useEffect(() => {
        fetchAllQuizzes();
    }, [location.pathname]);

    // Function to manually refresh quiz data
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAllQuizzes(true); // Force refresh
        setRefreshing(false);
    };
    // Memoize unique fields to avoid recomputing on every render
    const fields = useMemo(() => {
        const uniqueFields = new Set((quizzes || []).map(quiz => quiz.field || 'General'));
        return ['All', ...uniqueFields];
    }, [quizzes]);

    // Handle clearing the search input
    const handleClearSearch = () => {
        setSearch('');
    };

    return (
        <div className=" w-full max-w-3xl mx-auto px-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <label htmlFor="quiz-search" className="sr-only">
                        Search quizzes
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <FaSearch className="h-5 w-5 text-gray-500" aria-hidden="true" />
                        </span>
                        <input
                            id="quiz-search"

                            type="text"
                            placeholder="Search quizzes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={` w-full pl-12 pr-10 py-3 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                            transition-all duration-300 ease-in-out
                            shadow-sm text-sm ${theme === 'dark' ?
                                    'bg-gray-800 border border-gray-700 text-white placeholder-gray-400 hover:border-gray-600' :
                                    'bg-white border border-gray-200 text-gray-800 placeholder-gray-400 hover:border-indigo-300'}`}
                            aria-label="Search quizzes"
                        />
                        {search && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-4"
                                aria-label="Clear search"
                            >
                                <FaTimes className={`h-5 w-5 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-indigo-600'}`} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Dropdown */}
                <div className="relative w-full sm:w-40">
                    <label htmlFor="quiz-field" className="sr-only">
                        Filter by field
                    </label>
                    <select
                        id="quiz-field"
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        transition-all duration-300 ease-in-out
                        appearance-none shadow-sm text-sm cursor-pointer ${theme === 'dark' ?
                                'bg-gray-800 border border-gray-700 text-white hover:border-gray-600' :
                                'bg-white border border-gray-300 text-gray-800 hover:border-indigo-300'}`}
                        aria-label="Filter by field"
                    >
                        {fields.map(field => (
                            <option key={field} value={field}>
                                {field}
                            </option>
                        ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <FaFilter className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    </span>
                </div>

                {/* refresh button */}
                <div className="relative w-full sm:w-40">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing || isLoading}
                        title="Refresh quizzes"
                        className={`w-28 px-3 py-3 rounded-xl flex items-center jsustify-cente gap-4
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        transition-all duration-300 ease-in-out
                        appearance-none shadow-sm text-sm cursor-pointer ${theme === 'dark' ?
                                'bg-gray-800 border border-gray-700 text-white hover:border-gray-600' :
                                'bg-white border border-gray-300 text-gray-800 hover:border-indigo-300'}`}
                        aria-label="Filter by field"
                    >
                        Refresh  <TbRefresh className={`w-4 h-4 font-bold animate-spin  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>

                </div>
            </div>
        </div>
    );
}

export default QuizFilter;