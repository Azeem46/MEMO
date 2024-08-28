// src/components/PostList.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts, deletePost } from "../features/post/postSlice";

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.message}</p>
            <p>{post.tags}</p>
            <img src={post.selectedFile} alt={post.title} />
            <Link to={`/edit/${post._id}`} className="text-blue-500">
              Edit
            </Link>
            <button
              onClick={() => handleDelete(post._id)}
              className="text-red-500 ml-4"
            >
              Delete
            </button>
            <div className="mt-2">
              <Link to={`/posts/${post._id}`} className="text-blue-500">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
