import React from 'react';
import { useNavigate } from 'react-router-dom';
function QuizCard({ hading, Field, Questions, Time, link }) {
    const navigate = useNavigate()
    return (

        <div className=" h-56 md:w-72 w-80 m-5 border border-gray-100   rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 relative">
                <h2 className="text-xl font-semibold text-white leading-tight">
                    {hading}
                </h2>
                <div className="absolute -bottom-2 right-2 w-8 h-8 bg-white/20 rounded-full" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Details */}
                <div className="flex justify-between items-center text-sm ">
                    <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="">Questions</span>
                    </div>
                    <span className="font-medium">{Questions}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="">Time</span>
                    </div>
                    <span className="font-medium">{Time} min</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="">Field</span>
                    </div>
                    <span className="font-medium">{Field}</span>
                </div>

                {/* Button */}
                <button onClick={() => navigate(link)} className="w-full bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md">
                    Start Now
                </button>
            </div>
        </div>
    );
}

export default QuizCard;