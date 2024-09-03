import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import login from "../../public/images/home.png";
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

  // const handleClick = () => {
  //   navigate('/create');
  // };

  return user ? (
    <>
      <>
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
