import React from "react";
import { useAppContext } from "../context/app.context";

const ShimmerCard = () => {
  const { theme } = useAppContext();

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`w-72 h-56 rounded-2xl shadow-lg animate-pulse p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
        {/* Header area */}
        <div className={`h-12 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-lg mb-4`}></div>

        {/* Content area */}
        <div className="space-y-3">
          <div className={`h-4 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-2`}></div>
          <div className={`h-4 w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-2`}></div>
          <div className={`h-4 w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-4`}></div>

          {/* Button area */}
          <div className={`h-8 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-lg mt-2`}></div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerCard;
