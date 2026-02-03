// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostsByUser,
  likePost,
  addComment,
} = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");

// POST Routes

// Create a new post (requires auth)
router.post("/", verifyToken, createPost);

// Get all posts for HomePage (requires auth)
router.get("/", verifyToken, getAllPosts);

// Get posts by a specific user (requires auth)
// Example: /api/posts/user?userId=12345
router.get("/user", verifyToken, getPostsByUser);

// Like or Unlike a post (requires auth)
// Example: /api/posts/:postId/like
router.post("/:postId/like", verifyToken, likePost);

// Add a comment to a post (requires auth)
// Example: /api/posts/:postId/comment
router.post("/:postId/comment", verifyToken, addComment);

module.exports = router;
