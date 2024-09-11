import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import login from "../../public/images/login.png";
import PostList from "./PostList";

const Hero = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Redirect to home page if user is logged in
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleClick = () => {
    navigate("/create");
  };

  return user ? (
    <>
      <>
        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center absolute mt-4 right-4"
        >
          Create <span className="ml-2">+</span>
        </button>
        <PostList />
      </>
    </>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Image Section */}
      <div className="mb-8">
        <img
          src={login} // Replace with the actual path to your image
          alt="Login Required"
          className="w-52 h-52"
        />
      </div>

      {/* Text Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Please login.</h1>
        <p className="text-gray-600 font-bold">
          You have to login in order to view the memo.
        </p>
      </div>
    </div>
  );
};

export default Hero;
