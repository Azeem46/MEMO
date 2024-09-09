import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePost, fetchPostById } from "../features/post/postSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const PostEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState({
    title: "",
    message: "",
    tags: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (id) {
        const result = await dispatch(fetchPostById(id));
        if (result.payload) {
          setPost(result.payload);
        } else {
          toast.error("Failed to load post. Please try again.");
          navigate("/");
        }
        setLoading(false);
      }
    };

    loadPost();
  }, [id, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await dispatch(updatePost({ id, updatedPost: post }));
      toast.success("Post updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update post. Please try again.");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-2 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-500 pb-4">
        Edit Your Post
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            htmlFor="title"
            className="block text-lg text-gray-700 mb-2 font-semibold"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Ensure your title is clear and concise.
          </p>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-lg text-gray-700 mb-2 font-semibold"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={post.message}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200"
            rows="6"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Please make sure your post provides enough context.
          </p>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-lg text-gray-700 mb-2 font-semibold"
          >
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={post.tags}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition duration-200"
          />
          <p className="text-sm text-gray-500 mt-2">
            Add relevant tags for better visibility.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 flex justify-center items-center transition duration-200"
          disabled={submitting}
        >
          {submitting ? (
            <ClipLoader size={24} color={"#ffffff"} />
          ) : (
            "Update Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostEdit;
