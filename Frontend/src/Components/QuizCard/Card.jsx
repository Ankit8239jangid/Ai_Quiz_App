import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/app.context';
function QuizCard({ heading, Field, Questions, Time, link }) {
    const navigate = useNavigate();
    const { theme } = useAppContext();
    return (
        <div className={`card h-56 w-auto m-5 rounded-2xl overflow-hidden transition-all duration-300
            ${theme === 'dark' ?
                'border border-gray-700 bg-card-dark text-text-dark shadow-md shadow-gray-800' :
                'border border-gray-200 bg-card-light text-text-light shadow-md shadow-gray-300'}
            hover:shadow-lg hover:-translate-y-1`}>

            {/* Header */}
            <div className={`bg-gradient-to-br ${theme === 'dark' ?
                'from-indigo-700 via-purple-700 to-pink-700' :
                'from-indigo-500 via-purple-500 to-pink-500'} p-4 relative`}>
                <h2 className="text-xl font-semibold text-white leading-tight">
                    {heading}
                </h2>
                <div className="absolute -bottom-2 right-2 w-8 h-8 bg-white/20 rounded-full" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Details */}
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1">
                        <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Questions</span>
                    </div>
                    <span className="font-medium">{Questions}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1">
                        <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Time</span>
                    </div>
                    <span className="font-medium">{Time} min</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1">
                        <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Field</span>
                    </div>
                    <span className="font-medium">{Field}</span>
                </div>

                {/* Button */}
                <button
                    onClick={() => navigate(link)}
                    className={`w-full text-white text-sm py-2 rounded-lg shadow-sm hover:shadow-md
                        ${theme === 'dark' ?
                            'bg-primary-dark hover:bg-indigo-600' :
                            'bg-primary-light hover:bg-indigo-700'}`}>
                    Start Now
                </button>
            </div>
        </div>
    );
}

export default QuizCard;