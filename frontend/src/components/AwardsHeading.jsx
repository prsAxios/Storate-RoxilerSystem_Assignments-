import React from 'react';

const AwardsHeading = ({ text }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        {text}
      </h1>
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 w-1/3 mx-auto mt-4 rounded-full"></div>
    </div>
  );
};

export default AwardsHeading;
