import React, { useMemo } from 'react';
import { useAppContext } from '../../context/app.context';
import { FaSearch, FaTimes } from 'react-icons/fa';

function QuizFilter() {
    const { quizzes = [], search = '', setSearch, selectedField = 'All', setSelectedField } = useAppContext();

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
        <div className="w-full max-w-3xl mx-auto px-4 pb-6">
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
                            className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                            transition-all duration-300 ease-in-out hover:border-indigo-300 
                            bg-white shadow-sm text-black placeholder-gray-400 text-sm"
                            aria-label="Search quizzes"
                        />
                        {search && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-4"
                                aria-label="Clear search"
                            >
                                <FaTimes className="h-5 w-5 text-gray-500 hover:text-indigo-600 transition-colors duration-200" />
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
                        className="w-full px-4 py-3 border border-gray-400 rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                        transition-all duration-300 ease-in-out hover:border-indigo-300 
                        appearance-none bg-white shadow-sm text-black text-sm cursor-pointer"
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
                        <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default QuizFilter;