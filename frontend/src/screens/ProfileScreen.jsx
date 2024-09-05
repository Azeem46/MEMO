import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaTag, FaHeart } from "react-icons/fa";
import SyncLoader from "react-spinners/SyncLoader"; // Import a loader
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { fetchPosts, incrementPostViews } from "../features/post/postSlice";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true); // Loading state
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const navigate = useNavigate();

  // Filter posts by the current user's ID
  const userPosts = posts.filter((post) => post.creator === user.id);

  useEffect(() => {
    setLoading(true); // Set loading true when fetching starts
    dispatch(fetchPosts())
      .unwrap()
      .finally(() => setLoading(false)); // Disable loading when fetch is done
  }, [dispatch]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
    dispatch(incrementPostViews(postId));
    // Navigate to post details or show modal, etc.
  };

  return (
    <div className="py-14 px-4 max-sm:pt-4">
      <div className="flex flex-col items-start space-y-4">
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-7xl text-black" />
          <div className="text-black">
            <div className="text-xl font-semibold">{user.name}</div>
            <div className="text-sm text-black-500">
              {formatDate(user.joinDate)}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            className={`py-2 px-6 rounded-lg font-semibold ${
              activeTab === "posts"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`py-2 px-6 rounded-lg font-semibold border border-gray-300 flex items-center space-x-2 ${
              activeTab === "favourites"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setActiveTab("favourites")}
          >
            <FaTag />
            <span>Favourites</span>
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "posts" ? (
          <>
            <div className="text-xl font-semibold mb-4">Your Posts</div>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <SyncLoader size={15} color={"#3b82f6"} />{" "}
                {/* Loading spinner */}
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className="relative border p-4 rounded-lg shadow-sm bg-white group"
                    onClick={() => handlePostClick(post._id)}
                  >
                    <h2 className="text-lg font-bold">{post.title}</h2>
                    <p className="text-sm text-gray-600">{post.message}</p>
                    <p className="text-xs text-gray-500">{post.views} views</p>
                    {/* Like link/button */}
                    {/* <a
                      href={`/post/${post._id}/likePost`}
                      className="absolute bottom-2 left-2 text-blue-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Like this post
                    </a> */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No posts to show.</p>
            )}
          </>
        ) : (
          <div>
            <div className="text-xl font-semibold mb-4">Favourites</div>
            <p className="text-gray-600">No favourites to show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
