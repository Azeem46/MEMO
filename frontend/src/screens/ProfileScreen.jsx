import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaTag, FaHeart, FaTrash } from "react-icons/fa";
import SyncLoader from "react-spinners/SyncLoader";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import {
  fetchPosts,
  incrementPostViews,
  fetchBookmarks,
} from "../features/post/postSlice";
import { GrView } from "react-icons/gr";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true); // Loading state
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const bookmarks = useSelector((state) => state.posts.bookmarks); // Add this
  console.log(bookmarks);
  const navigate = useNavigate();

  // Filter posts by the current user's ID
  const userPosts = posts.filter((post) => post.creator === user.id);

  // Filter bookmarks by the current user's ID
  const userBookmarks = bookmarks.filter(
    (bookmark) => bookmark.user._id === user._id
  );

  useEffect(() => {
    setLoading(true); // Set loading true when fetching starts
    dispatch(fetchPosts())
      .unwrap()
      .finally(() => setLoading(false)); // Disable loading when fetch is done

    dispatch(fetchBookmarks(user._id)); // Fetch bookmarks
  }, [dispatch, user._id]);

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
                    className="flex border p-4 rounded-lg shadow-sm bg-white cursor-pointer"
                    onClick={() => handlePostClick(post._id)}
                  >
                    {/* Post Image */}
                    <img
                      src={post.selectedFile}
                      alt={post.title}
                      className="w-32 h-32 object-cover rounded-lg mr-4"
                    />

                    {/* Post Content */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        {/* Post Title */}
                        <h2 className="text-lg font-bold text-black mb-2">
                          {post.title}
                        </h2>

                        {/* Post Excerpt */}
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {post.message}
                        </p>
                      </div>

                      {/* Views and Interaction */}
                      <div className="flex items-center justify-between text-gray-500 text-xs mt-2">
                        {/* Views count */}
                        <span className="flex items-center space-x-1">
                          <GrView /> {/* View icon */}
                          <span>{post.views} views</span>
                        </span>

                        {/* Interaction Buttons */}
                        <div className="flex space-x-4">
                          {/* Delete button */}
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
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
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <SyncLoader size={15} color={"#3b82f6"} />{" "}
                {/* Loading spinner */}
              </div>
            ) : userBookmarks.length > 0 ? (
              <div className="space-y-4">
                {userBookmarks.map((bookmark) => {
                  const post = bookmark.post; // Ensure bookmark includes post
                  return (
                    <div
                      key={post._id}
                      className="flex border p-4 rounded-lg shadow-sm bg-white cursor-pointer"
                      onClick={() => handlePostClick(post._id)}
                    >
                      {/* Post Image */}
                      <img
                        src={post.selectedFile}
                        alt={post.title}
                        className="w-32 h-32 object-cover rounded-lg mr-4"
                      />

                      {/* Post Content */}
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          {/* Post Title */}
                          <h2 className="text-lg font-bold text-black mb-2">
                            {post.title}
                          </h2>

                          {/* Post Excerpt */}
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {post.message}
                          </p>
                        </div>

                        {/* Views and Interaction */}
                        <div className="flex items-center justify-between text-gray-500 text-xs mt-2">
                          {/* Views count */}
                          <span className="flex items-center space-x-1">
                            <GrView /> {/* View icon */}
                            <span>{post.views} views</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600">No favourites to show.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
