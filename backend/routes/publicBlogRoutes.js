const express = require("express");
const router = express.Router();
const {
  getPublicBlogPosts,
  getBlogPost,
  incrementBlogViews,
} = require("../controllers/blogController.js");

// Public blog routes (no authentication required)
router.get("/posts", getPublicBlogPosts);
router.get("/post/:postId", getBlogPost);
router.post("/post/:postId/view", incrementBlogViews);

module.exports = router; 