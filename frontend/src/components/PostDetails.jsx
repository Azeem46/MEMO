import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, clearPost, commentPost } from "../features/post/postSlice";
import { useParams } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { timeAgo } from "../utils/timestamp";

const PostDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const post = useSelector((state) => state.posts.post);
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.auth.user.name);

  useEffect(() => {
    if (id) {
      dispatch(clearPost());
      dispatch(fetchPost(id));
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
      await dispatch(commentPost({ id, comment: formattedComment }));
      setComment("");
      await dispatch(fetchPost(id));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      {post ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            {post.title}
          </h1>
          <div className="mb-6">
            <img
              src={post.selectedFile}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
            />
            <p className="text-gray-700 mb-4">{post.message}</p>
            <div className="flex flex-wrap text-gray-600 mb-4">
              {post.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Created by: {post.creatorName}
            </p>
            <p className="text-gray-400 text-xs">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Comments
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 mb-4"
                rows="3"
                placeholder="Add a comment..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md transition-all"
              >
                Post
              </button>
            </form>

            <div className="space-y-6">
              {post.comments.map((c, index) => (
                <div
                  key={index}
                  className={`flex items-start ${
                    index % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                  } p-4 rounded-lg shadow-sm`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <span className="text-xl font-bold uppercase">
                        {c.split(": ")[0].charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-800">
                      {c.split(": ")[0]}
                    </div>
                    <div className="text-gray-700">{c.split(": ")[1]}</div>
                    <div className="text-gray-400 text-xs mt-1">
                      {/* Example timestamp */}
                      {timeAgo("2024-09-01T10:15:30Z")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ThreeCircles
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      )}
    </div>
  );
};

export default PostDetails;
