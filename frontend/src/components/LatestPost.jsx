import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestPosts } from "../features/post/postSlice";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";

const LatestPost = () => {
  const dispatch = useDispatch();
  const latestPosts = useSelector((state) => state.posts.latestPosts || []); // Ensure latestPosts is always an array
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchLatestPosts());
  }, [dispatch]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Latest Posts</h2>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && latestPosts.length === 0 && (
        <p>No posts available.</p>
      )}
      {status === "succeeded" && latestPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full"
              onClick={() => handlePostClick(post._id)}
            >
              <img
                src={post.selectedFile}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-gray-700">{post.message}</p>
                <div className="flex justify-between mt-2 text-gray-500">
                  <span>Published by: {post.creatorName}</span>
                  <span className="flex items-center">
                    <GrView className="mr-1" /> {post.views}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestPost;
