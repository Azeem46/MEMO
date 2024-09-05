import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUserCircle, FaTag } from "react-icons/fa";
import { formatDate } from "../utils/formatDate";
import { fetchPosts } from "../features/post/postSlice";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("posts"); // State to track active tab
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const posts = useSelector((state) => state.posts.posts);
  console.log(posts);
  // Filter posts by the current user's ID
  const userPosts = posts.filter((post) => post.creator === user.id);
  console.log(userPosts);

  useEffect(() => {
    if (!posts.length) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts]);

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
            {userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className="border p-4 rounded-lg shadow-sm bg-white"
                  >
                    <h2 className="text-lg font-bold">{post.title}</h2>
                    <p className="text-sm text-gray-600">{post.message}</p>
                    {/* Add more post details here if needed */}
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
            {/* Add favourite posts logic here */}
            <p className="text-gray-600">No favourites to show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
