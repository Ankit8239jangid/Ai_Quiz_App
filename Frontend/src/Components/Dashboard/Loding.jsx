import React from 'react';
const DashboardShimmer = () => {  return (
    <div className="animate-pulse">      {/* Header */}
      <div className="mb-8">
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>      </div>
      {/* Stats Section */}      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (          <div key={i} className="bg-gray-300 p-6 rounded-lg">
            <div className="h-4 bg-gray-400 rounded w-1/2 mb-2"></div>            <div className="h-8 bg-gray-400 rounded w-3/4"></div>
          </div>
        ))}      </div>
      {/* My Quizzes Section */}      <div className="mb-8">
        <div className="h-6 bg-gray-300 rounded w-1/5 mb-4"></div>        <div className="bg-gray-300 rounded-lg p-4">
          <div className="h-4 bg-gray-400 rounded w-full mb-4"></div>          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-400 rounded w-full mb-2"></div>          ))}
        </div>      </div>
      {/* Recent Attempts Section */}
      <div>        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="bg-gray-300 rounded-lg p-4">          <div className="h-4 bg-gray-400 rounded w-full mb-4"></div>
          {[1, 2, 3].map((i) => (            <div key={i} className="h-8 bg-gray-400 rounded w-full mb-2"></div>
          ))}        </div>
      </div>
    </div>
  )};

export default DashboardShimmer;
;




















