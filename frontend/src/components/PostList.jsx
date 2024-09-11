// src/components/PostList.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchPosts,
  deletePost,
  likePost,
  incrementPostViews,
  createBookmark,
  removeBookmark,
  fetchBookmarks,
} from "../features/post/postSlice";
import {
  FaEdit,
  FaTrashAlt,
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
  FaBookmark,
  FaFire,
  FaRegBookmark,
} from "react-icons/fa";
import SyncLoader from "react-spinners/SyncLoader";
import ClipLoader from "react-spinners/ClipLoader"; // Loader for delete button
import { toast } from "react-toastify";
import { GrView } from "react-icons/gr";
import { decrementPostCount } from "../features/auth/authSlice";

const PostList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const userId = useSelector((state) => state.auth.user.id);
  const bookmarks = useSelector((state) => state.posts.bookmarks);
  const currentPage = useSelector((state) => state.posts.currentPage);
  const numberOfPages = useSelector((state) => state.posts.numberOfPages);
  const [page, setPage] = useState(1);
  const [deletingPostId, setDeletingPostId] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts(page));
    dispatch(fetchBookmarks(userId));
  }, [location, dispatch, page, userId]);

  const handleNextPage = () => {
    if (page < numberOfPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingPostId(id); // Set the post as being deleted
      await dispatch(deletePost(id)).unwrap(); // Ensure the delete operation completes
      dispatch(fetchBookmarks());
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setDeletingPostId(null); // Reset the loading state
    }
  };

  const handleLike = (id) => {
    dispatch(likePost(id));
  };

  const handlePostClick = (postId) => {
    dispatch(incrementPostViews(postId)); // Increment view count when post is clicked
    navigate(`/post/${postId}`);
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

  const handleTrendingClick = () => {
    navigate("/trending");
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3">Posts</h1>
      <div className="flex item-center gap-5 ">
        <button
          onClick={handleTrendingClick}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:from-orange-600 hover:to-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center mb-2"
        >
          <FaFire className="mr-2" />
          Trending
        </button>
        <button
          onClick={() => navigate("/latest")}
          className="block sm:hidden px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:from-green-600 hover:to-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 flex items-center mb-2"
        >
          <FaFire className="mr-2" />
          Latest
        </button>
      </div>

      {status === "loading" && (
        <div className="flex justify-center items-center h-64">
          <SyncLoader size={15} color={"#3b82f6"} />
        </div>
      )}

      {status === "failed" && <p className="text-red-500">Error: {error}</p>}

      {status === "succeeded" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const tags = post.tags[0].split(",").map((tag) => tag.trim());
            const isLiked =
              Array.isArray(post.likes) && post.likes.includes(userId);
            const likesCount = post.likes?.length ?? 0;
            const isBookmarked = bookmarks.some(
              (bookmark) => bookmark?.post?._id === post._id
            );

            return (
              <div
                key={post._id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-48">
                  <img
                    src={post.selectedFile}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="p-4 flex-grow flex flex-col"
                  onClick={() => handlePostClick(post._id)} // Make the entire post card clickable
                  role="button"
                  tabIndex={0} // Ensure it's keyboard accessible
                  onKeyDown={(e) =>
                    e.key === "Enter" && handlePostClick(post._id)
                  } // For accessibility
                >
                  <div className="mb-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-700 mb-4 flex-grow line-clamp-2">
                    {post.message}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Published by: {post.creatorName}</span>
                    <span className="flex items-center">
                      <GrView className="mr-1" /> {post.views}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-100 flex justify-between items-center">
                  <div className="flex space-x-4 items-center">
                    {userId === post.creator && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit/${post._id}`);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post._id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          {/* Show loading spinner during delete operation */}
                          {deletingPostId === post._id ? (
                            <ClipLoader size={20} color={"#f87171"} />
                          ) : (
                            <FaTrashAlt />
                          )}
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post._id);
                      }}
                      className={`flex items-center ${
                        isLiked ? "text-red-500" : "text-gray-500"
                      } hover:text-red-700`}
                    >
                      {isLiked ? <FaHeart /> : <FaRegHeart />}
                      <span className="ml-1">{likesCount}</span>
                    </button>
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
                  <button
                    onClick={() => handlePostClick(post._id)}
                    className="text-blue-500 hover:underline"
                  >
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        <span className="flex items-center">
          Page {currentPage} of {numberOfPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === numberOfPages}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default PostList;
