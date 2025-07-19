const express = require("express");
const router = express.Router();
const {
  createBlogPost,
  getAllBlogPosts,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
  bulkDeleteBlogPosts,
  toggleBlogStatus,
  publishAllDrafts,
  getBlogStats,
} = require("../controllers/blogController.js");
const adminAuth = require("../helper/adminAuth.js");
const upload = require("../utils/multer.js");


// Blog post routes
router.post("/create", adminAuth, upload.single("image"), createBlogPost);
router.get("/all", adminAuth, getAllBlogPosts);
router.get("/:id", adminAuth, getBlogPost);
router.patch("/update/:id", adminAuth, upload.single("image"), updateBlogPost);
router.delete("/delete/:id", adminAuth, deleteBlogPost);
router.delete("/bulk-delete", adminAuth, bulkDeleteBlogPosts);
router.patch("/toggle-status/:id", adminAuth, toggleBlogStatus);
router.post("/publish-all-drafts", adminAuth, publishAllDrafts);
router.get("/stats/overview", adminAuth, getBlogStats);

module.exports = router; 