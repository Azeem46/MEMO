import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPosts, deletePost } from "../features/post/postSlice";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import SyncLoader from "react-spinners/SyncLoader";

const PostList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const user = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      {status === "loading" && (
        <div className="flex justify-center items-center h-64">
          <SyncLoader size={15} color={"#3b82f6"} />
        </div>
      )}

      {status === "failed" && <p className="text-red-500">Error: {error}</p>}

      {status === "succeeded" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-start">
          {posts.map((post) => {
            const tags = post.tags[0].split(",").map((tag) => tag.trim());

            return (
              <div
                key={post._id}
                className="relative bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handlePostClick(post._id)}
              >
                <div className="relative">
                  <img
                    src={post.selectedFile}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-start justify-start p-2">
                    <h2 className="text-white text-lg font-semibold">
                      Author: {post.creatorName}
                    </h2>
                  </div>
                </div>
                <p className="mb-2 mt-2 ml-4">
                  {tags.map((tag, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && " "}#{tag}
                    </React.Fragment>
                  ))}
                </p>
                <b>
                  <p className="mt-2 ml-4 text-2xl">{post.title}</p>
                </b>
                <div className="p-4">
                  <p
                    className="mb-4 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      textOverflow: "ellipsis",
                    }}
                  >
                    <i>{post.message}</i>
                  </p>

                  {user === post.creator && (
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit/${post._id}`);
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post._id);
                        }}
                        className="text-red-500 hover:underline"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostList;
