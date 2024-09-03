import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PostList from "../components/PostList";

const SearchResults = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts } = useSelector((state) => state.posts);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("searchQuery") || "";
    const tags = queryParams.get("tags") || "";

    dispatch(fetchPostsBySearch({ search: searchQuery, tags }));
  }, [location.search, dispatch]);

  useEffect(() => {
    console.log("Posts from Redux:", posts); // Add this line
  }, [posts]);

  return (
    <div>
      <h1>Search Results</h1>
      <PostList posts={posts} />
    </div>
  );
};

export default SearchResults;
