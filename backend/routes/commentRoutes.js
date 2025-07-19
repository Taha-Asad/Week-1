const express = require("express");
const router = express.Router();
const {
  addComment,
  getBlogComments,
  getAllComments,
  updateCommentStatus,
  deleteComment,
  bulkDeleteComments,
} = require("../controllers/commentController.js");
const adminAuth = require("../helper/adminAuth.js");

// Public comment routes (no authentication required)
router.post("/add", addComment);
router.get("/blog/:blogId", getBlogComments);

// Admin comment routes (authentication required)
router.get("/admin/all", adminAuth, getAllComments);
router.patch("/admin/status/:id", adminAuth, updateCommentStatus);
router.delete("/admin/delete/:id", adminAuth, deleteComment);
router.delete("/admin/bulk-delete", adminAuth, bulkDeleteComments);

module.exports = router; 