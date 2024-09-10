import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchLatestPosts } from "../features/post/postSlice";
import { GrView } from "react-icons/gr";
import { likePost } from "../features/post/postSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import SyncLoader from "react-spinners/SyncLoader"; // Optional loading spinner

const LatestPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const latestPosts = useSelector((state) => state.posts.latestPosts || []); // Ensure latestPosts is always an array
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const userId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    dispatch(fetchLatestPosts());
  }, [dispatch, location]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleLike = (id) => {
    dispatch(likePost(id));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-3">Latest Posts</h2>

      {status === "loading" && (
        <div className="flex justify-center items-center h-64">
          <SyncLoader size={15} color={"#3b82f6"} />
        </div>
      )}

      {status === "failed" && <p className="text-red-500">Error: {error}</p>}

      {status === "succeeded" && latestPosts.length === 0 && (
        <p>No posts available.</p>
      )}

      {status === "succeeded" && latestPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => {
            const tags = post.tags[0].split(",").map((tag) => tag.trim());
            const isLiked =
              Array.isArray(post.likes) && post.likes.includes(userId);
            const likesCount = post.likes?.length ?? 0;
            return (
              <div
                key={post._id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-48">
                  <img
                    src={post.selectedFile}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="p-4 flex-grow flex flex-col"
                  onClick={() => handlePostClick(post._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handlePostClick(post._id)
                  }
                >
                  <div className="mb-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-700 mb-4 flex-grow line-clamp-2">
                    {post.message}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Published by: {post.creatorName}</span>
                    <span className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post._id);
                        }}
                        className={`flex items-center mr-2 ${
                          isLiked ? "text-red-500" : "text-gray-500"
                        } hover:text-red-700`}
                      >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                        <span className="ml-1">{likesCount}</span>
                      </button>
                      <GrView className="mr-1" /> {post.views} Views
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LatestPost;
