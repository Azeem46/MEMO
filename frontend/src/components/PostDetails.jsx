import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPost,
  clearPost,
  fetchComments,
  createComment,
  deleteComment,
  updateComment,
  createBookmark,
  removeBookmark,
  fetchBookmarks,
} from "../features/post/postSlice";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { formatDate } from "../utils/formatDate";
import { FaEdit, FaTrash, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { Bookmark } from "lucide-react";
import { toast } from "react-toastify";

const PostDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const post = useSelector((state) => state.posts.post);
  const comments = useSelector((state) => state.posts.comments);
  const [comment, setComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const bookmarks = useSelector((state) => state.posts.bookmarks);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add local state for submitting
  const user = useSelector((state) => state.auth.user.name);
  const userId = useSelector((state) => state.auth.user.id);
  const isBookmarked =
    post && bookmarks.some((bookmark) => bookmark?.post?._id === post._id);

  useEffect(() => {
    if (id) {
      dispatch(clearPost());
      dispatch(fetchPost(id));
      dispatch(fetchComments(id)); // Fetch comments for the post
      dispatch(fetchBookmarks(userId)); // Fetch user's bookmarks
    }
  }, [id, dispatch, userId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      console.error("Post ID is missing.");
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    try {
      const newComment = await dispatch(
        createComment({ postId: id, text: `${user}: ${comment}` })
      );
      setComment("");
      // Optionally, you can manually update the comments state if needed
      dispatch(fetchComments(id)); // Re-fetch comments or
      dispatch(fetchPost(id)); // Re-fetch post to get the latest comments
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await dispatch(deleteComment(commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentEdit = async (commentId) => {
    setIsUpdating(true); // Start loading
    try {
      const commentToUpdate = comments.find((c) => c._id === commentId);
      const originalName = commentToUpdate.text.split(": ")[0]; // Extract the original name

      // Combine the original name with the updated comment text
      const updatedText = `${originalName}: ${editText}`;

      await dispatch(updateComment({ id: commentId, text: updatedText }));
      setEditCommentId(null);
      setEditText("");
      setIsUpdating(false); // Stop loading

      // Optionally, you can manually update the comments state if needed
      dispatch(fetchComments(id)); // Re-fetch comments or
      dispatch(fetchPost(id)); // Re-fetch post to get the latest comments
    } catch (error) {
      console.error("Error updating comment:", error);
      setIsUpdating(false); // Stop loading even if there's an error
    }
  };

  const handleBookmark = (post) => {
    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.post._id === post._id
    );
    if (isBookmarked) {
      const bookmarkId = bookmarks.find(
        (bookmark) => bookmark.post._id === post._id
      )._id;
      dispatch(removeBookmark(bookmarkId)).then(() => {
        dispatch(fetchBookmarks(userId));
        toast.success("Bookmark removed successfully!");
      });
    } else {
      dispatch(createBookmark(post._id)).then(() => {
        dispatch(fetchBookmarks(userId));
        toast.success("Post bookmarked successfully!");
      });
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
              className="w-full h-72 object-cover rounded-lg shadow-md mb-6"
            />
            <div className="flex justify-between w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmark(post);
                }}
                className={`${
                  isBookmarked ? "text-yellow-500" : "text-gray-500"
                } hover:text-yellow-700`}
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>
            {userId === post.creator && (
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${post._id}`);
                  }}
                  className="text-blue-500 hover:text-blue-700 flex items-center p-3 mb-7 transition duration-200 ease-in-out transform border rounded-md shadow-md bg-slate-200 hover:bg-slate-300 focus:outline-none"
                >
                  <FaEdit className="mr-2" />
                  <span>Edit Post</span>
                </button>
              </div>
            )}

            <p className="text-gray-700 mb-4">{post.message}</p>

            {/* Updated Tag Display */}
            <div className="flex flex-wrap text-gray-600 mb-4">
              {post.tags &&
                post.tags[0].split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {index > 0 && " "}#{tag.trim()}
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
                disabled={isSubmitting} // Disable button during submission
              >
                {isSubmitting ? (
                  <ThreeCircles
                    visible={true}
                    height="24"
                    width="24"
                    ariaLabel="submitting-loading"
                    wrapperStyle={{ display: "inline-block" }}
                    colors={["#fff", "#f8b26a", "#abbd81", "#849b87"]}
                  />
                ) : (
                  "Post"
                )}
              </button>
            </form>

            <div className="space-y-6">
              {comments.map((c, index) => (
                <div
                  key={c._id}
                  className={`flex items-start ${
                    index % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                  } p-4 rounded-lg shadow-sm`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <span className="text-xl font-bold uppercase">
                        {c.text.split(": ")[0].charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-semibold text-gray-800">
                      {c.text.split(": ")[0]}
                    </div>
                    <div className="text-gray-700">{c.text.split(": ")[1]}</div>
                    <div className="text-gray-400 text-xs mt-1">
                      {formatDate(c.createdAt)}
                    </div>
                    {/* Edit and Delete icons */}
                    {c.userId._id === userId && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => {
                            setEditCommentId(c._id);
                            setEditText(c.text.split(": ").slice(1).join(": "));
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleCommentDelete(c._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}

                    {/* Edit Comment Form */}
                    {editCommentId === c._id && (
                      <div className="mt-4">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 mb-4"
                          rows="2"
                          placeholder="Edit your comment..."
                        />
                        <button
                          onClick={() => handleCommentEdit(c._id)}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md transition-all"
                          disabled={isUpdating} // Disable button during update
                        >
                          {isUpdating ? (
                            <ThreeCircles
                              visible={true}
                              height="24"
                              width="24"
                              ariaLabel="updating-loading"
                              wrapperStyle={{ display: "inline-block" }}
                              colors={["#fff", "#f8b26a", "#abbd81", "#849b87"]}
                            />
                          ) : (
                            "Update"
                          )}
                        </button>
                      </div>
                    )}
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
