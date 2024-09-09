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
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight text-center">
        Create a New Post
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            htmlFor="title"
            className="block text-xl font-semibold text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Enter a captivating title"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Your title should be at least 5 characters long for clarity.
          </p>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xl font-semibold text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={post.message}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 transition-shadow shadow-sm hover:shadow-md"
            rows="3"
            placeholder="Write something meaningful..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            📝 Make sure your message is at least 20 words to engage your
            audience.
          </p>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-xl font-semibold text-gray-700 mb-2"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={post.tags}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 transition-shadow shadow-sm hover:shadow-md"
            placeholder="e.g., tech, lifestyle"
          />
        </div>

        <div>
          <label
            htmlFor="file"
            className="block text-xl font-semibold text-gray-700 mb-2"
          >
            Upload an Image
          </label>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Choose Image
            </button>
            <p className="text-sm text-gray-500">Max size: 10 MB</p>
          </div>

          {imagePreview && (
            <div className="relative mt-6 w-full h-64 rounded-lg shadow-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-full h-full object-cover"
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
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl focus:ring-4 focus:ring-blue-500 transition-all flex justify-center items-center"
          disabled={loading}
        >
          {showLoader ? (
            <ClipLoader size={24} color={"#ffffff"} delay={500} />
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
