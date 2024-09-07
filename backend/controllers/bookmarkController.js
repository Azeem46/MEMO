import BookMark from "../models/BookmarkModels.js";
import Posts from "../models/PostModels.js";

// Create a new bookmark
export const createBookmark = async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingBookmark = await BookMark.findOne({
      user: userId,
      post: postId,
    });
    if (existingBookmark) {
      return res.status(400).json({ message: "Post already bookmarked" });
    }

    const bookmark = new BookMark({
      user: userId,
      post: postId,
    });

    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all bookmarks of a user
export const getBookmarks = async (req, res) => {
  const userId = req.userId; // this should be set by the authentication middleware
  console.log("User ID: ", userId); // Add this log to check userId

  try {
    const bookmarks = await BookMark.find({ user: userId }).populate({
      path: "post",
      model: "Posts", // Ensure you are using the correct model name here
    });

    res.status(200).json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks: ", error); // Log the error
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Remove a bookmark
export const removeBookmark = async (req, res) => {
  const { id } = req.params; // bookmark ID
  const userId = req.userId;

  try {
    // Find the bookmark by its ID
    const bookmark = await BookMark.findById(id);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // Check if the bookmark belongs to the requesting user
    if (bookmark.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Use deleteOne() instead of remove()
    await BookMark.deleteOne({ _id: id });

    res.status(200).json({ message: "Bookmark removed" });
  } catch (error) {
    console.error("Error during bookmark removal:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
