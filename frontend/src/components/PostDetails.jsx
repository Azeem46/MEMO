import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, clearPost } from "../features/post/postSlice";
import { useParams } from "react-router-dom";
import { ColorRing, FidgetSpinner, ThreeCircles } from "react-loader-spinner";

const PostDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const post = useSelector((state) => state.posts.post);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user.name);

  useEffect(() => {
    if (id) {
      dispatch(clearPost()); // Clear the previous post data
      dispatch(fetchPost(id)); // Fetch new post data
    }
  }, [id, dispatch]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      console.error("Post ID is missing.");
      return;
    }

    const formattedComment = `${user}: ${comment}`;

    try {
      // Dispatch the comment with the formatted string
      await dispatch(commentPost({ id, comment: formattedComment }));
      setComment("");

      // Optionally refetch the post to get the latest comments
      await dispatch(fetchPost(id));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {post ? (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex flex-wrap text-gray-600 mb-4">
              {post.tags?.map((tag, index) => (
                <span key={index} className="mr-2">
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-4">{post.message}</p>
            <p className="text-gray-500 text-sm mb-4">
              Created by: {post.creatorName}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {new Date(post.createdAt).toLocaleString()}
            </p>
            <hr className="my-4" />
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            <div className="max-h-48 overflow-y-auto mb-4">
              {post.comments.map((c, index) => (
                <div key={index} className="mb-2">
                  <span className="font-bold">{c.split(": ")[0]}:</span>
                  <span className="ml-2">{c.split(": ")[1]}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                rows="2"
                placeholder="Write a Comment"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Comment
              </button>
            </form>
          </div>
          <div className="flex-shrink-0 w-full md:w-1/3">
            <img
              src={post.selectedFile}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full mt-52">
          <ThreeCircles
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            delay={1000}
          />
        </div>
      )}
    </div>
  );
};

export default PostDetails;
