import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../features/post/postSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchUserById } from "../features/auth/userActions";
import { incrementPostCount } from "../features/auth/authSlice";

const PostForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user);

  const [post, setPost] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });

  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Using ref to directly access the file input element
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowLoader(true), 500); // Delay of 500ms
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPost({ ...post, selectedFile: reader.result });
      setImagePreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImage = () => {
    setPost({ ...post, selectedFile: "" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createPost(post));
      dispatch(incrementPostCount());
      await dispatch(fetchUserById(userId));
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-2">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Create Post</h1>
      <p className="text-sm text-gray-600 mb-6">
        Ensure your title is at least 5 characters long for a concise and
        captivating headline.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-lg text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={post.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="6"
            required
          />
          <p className="text-sm text-gray-600 mt-2">
            📝 Please write a minimum of 20 words to make your blog post
            meaningful and engaging.
          </p>
        </div>

        <div>
          <label htmlFor="tags" className="block text-lg text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={post.tags}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-lg text-gray-700 mb-2">
            Image
          </label>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            Image size must be less than 10 MB*
          </p>
          {imagePreview && (
            <div className="relative mt-4 w-full h-64">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={handleCancelImage}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 flex justify-center items-center"
          disabled={loading}
        >
          {showLoader ? (
            <ClipLoader size={24} color={"#ffffff"} delay={1000} />
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
