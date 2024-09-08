import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../features/post/postSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchUserById } from "../features/auth/userActions";
import { incrementPostCount } from "../features/auth/authSlice";

const PostForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = useSelector((state) => state.auth.user);
  const postToEdit = useSelector((state) =>
    id ? state.posts.posts.find((p) => p._id === id) : null
  );

  const [post, setPost] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setPost(postToEdit);
      setIsEditing(true);
    }
  }, [postToEdit]);

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
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (id) {
      await dispatch(updatePost({ id, updatedPost: post }));
      toast.success("Post updated successfully!");
    } else {
      await dispatch(createPost(post));
      dispatch(incrementPostCount()); // Increment post count locally
      await dispatch(fetchUserById(userId)); // Also fetch updated user data
      toast.success("Post created successfully!");
    }

    setLoading(false);
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Post" : "Create Post"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={post.message}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            required
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={post.tags}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {!isEditing && (
          <div>
            <label htmlFor="file" className="block text-gray-700">
              Image
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex justify-center items-center"
          disabled={loading}
        >
          {showLoader ? (
            <ClipLoader size={24} color={"#ffffff"} delay={1000} />
          ) : id ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
