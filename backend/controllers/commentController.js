const Comment = require("../models/comment.js");
const Blog = require("../models/blog.js");

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { blogId, name, email, content } = req.body;
    
    // Validate blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if blog is published
    if (blog.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Cannot comment on unpublished blog posts",
      });
    }

    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    const comment = new Comment({
      blogId,
      name,
      email,
      content,
      ipAddress,
      userAgent,
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: "Comment submitted successfully and awaiting approval",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get approved comments for a blog post
const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Validate blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const comments = await Comment.find({
      blogId,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      comments,
      total: comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all comments (admin only)
const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, blogId } = req.query;

    const query = {};
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (blogId) {
      query.blogId = blogId;
    }

    const comments = await Comment.find(query)
      .populate("blogId", "title")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Comment.countDocuments(query);

    res.status(200).json({
      success: true,
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update comment status (admin only)
const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending, approved, or rejected",
      });
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("blogId", "title");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment status updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Error updating comment status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete comment (admin only)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk delete comments (admin only)
const bulkDeleteComments = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide array of comment IDs",
      });
    }

    const result = await Comment.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} comments deleted successfully`,
    });
  } catch (error) {
    console.error("Error bulk deleting comments:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addComment,
  getBlogComments,
  getAllComments,
  updateCommentStatus,
  deleteComment,
  bulkDeleteComments,
}; 