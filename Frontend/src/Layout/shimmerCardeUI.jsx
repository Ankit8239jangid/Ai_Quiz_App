import React from "react";

const ShimmerCard = () => {
  return (
    <div className=" flex justify-center items-center p-4">
      <div className=" w-72 h-48  bg-gray-200 rounded-lg shadow-lg animate-pulse p-4">
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default ShimmerCard;
