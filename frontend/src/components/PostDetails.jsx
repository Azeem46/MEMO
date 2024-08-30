import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, commentPost } from "../features/post/postSlice";
import { useParams } from "react-router-dom";

const PostDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const post = useSelector((state) => state.posts.post);
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.auth.user.name);

  useEffect(() => {
    if (id) {
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
        <>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="mb-4">{post.message}</p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Comments</h2>
            <form onSubmit={handleCommentSubmit} className="mt-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                placeholder="Add a comment"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
              >
                Add Comment
              </button>
            </form>
            <div className="mt-4">
              {post.comments.map((c, index) => (
                <div key={index} className="border p-2 rounded mb-2">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetails;
