import React from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Example loading animation

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ClipLoader color="#4A90E2" size={150} />
    </div>
  );
};

export default LoadingAnimation;
