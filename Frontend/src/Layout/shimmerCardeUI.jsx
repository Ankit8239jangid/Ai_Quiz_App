import React from "react";

const ShimmerCard = () => {
  return (
    <div className=" h-48 bg-gray-200 rounded-lg shadow-lg animate-pulse p-4">
      <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
    </div>
  );
};

export default ShimmerCard;
