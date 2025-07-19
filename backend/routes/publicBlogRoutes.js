const express = require("express");
const router = express.Router();
const {
  getPublicBlogPosts,
  getBlogPost,
} = require("../controllers/blogController.js");

// Public blog routes (no authentication required)
router.get("/posts", getPublicBlogPosts);
router.get("/post/:id", getBlogPost);

module.exports = router; 