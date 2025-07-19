const Blog = require("../models/blog.js");
const Admin = require("../models/admin.js");
const fs = require("fs");
const path = require("path");

// Create new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, content, excerpt, tags, status, featured } = req.body;
    
    // Check if admin exists
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const blogData = {
      title,
      content,
      excerpt,
      author: req.adminId,
      status: status || "published", // Changed default to published
      featured: featured === "true" || featured === true,
    };

    // Add tags if provided
    if (tags) {
      blogData.tags = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
    }

    // Add image if uploaded
    if (req.file) {
      blogData.image = req.file.filename;
    }

    const blog = new Blog(blogData);
    await blog.save();

    // Populate author details
    await blog.populate("author", "name");

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all blog posts (admin)
const getAllBlogPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const query = {};
    
    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const blogs = await Blog.find(query)
      .populate("author", "name")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get public blog posts (for users)
const getPublicBlogPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const query = { status: "published" };
    
    console.log('Fetching public blog posts with query:', query);
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const blogs = await Blog.find(query)
      .populate("author", "name")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching public blog posts:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single blog post
const getBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id).populate("author", "name");
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update blog post
const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, tags, status, featured } = req.body;

    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if admin is the author
    if (blog.author.toString() !== req.adminId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own blog posts",
      });
    }

    const updateData = {
      title,
      content,
      excerpt,
      status: status || blog.status,
      featured: featured === "true" || featured === true,
    };

    // Update tags if provided
    if (tags) {
      updateData.tags = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
    }

    // Update image if uploaded
    if (req.file) {
      // Delete old image if it exists and is not default
      if (blog.image && blog.image !== "default-blog.jpg") {
        try {
          fs.unlinkSync(path.join(__dirname, "../uploads", blog.image));
        } catch (error) {
          console.log("Error deleting old image:", error.message);
        }
      }
      updateData.image = req.file.filename;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("author", "name");

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete blog post
const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if admin is the author
    if (blog.author.toString() !== req.adminId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own blog posts",
      });
    }

    // Delete image if it exists and is not default
    if (blog.image && blog.image !== "default-blog.jpg") {
      try {
        fs.unlinkSync(path.join(__dirname, "../uploads", blog.image));
      } catch (error) {
        console.log("Error deleting image:", error.message);
      }
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk delete blog posts
const bulkDeleteBlogPosts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide array of blog post IDs",
      });
    }

    // Get blogs to check ownership and delete images
    const blogs = await Blog.find({ _id: { $in: ids }, author: req.adminId });
    
    // Delete images
    for (const blog of blogs) {
      if (blog.image && blog.image !== "default-blog.jpg") {
        try {
          fs.unlinkSync(path.join(__dirname, "../uploads", blog.image));
        } catch (error) {
          console.log("Error deleting image:", error.message);
        }
      }
    }

    const result = await Blog.deleteMany({ _id: { $in: ids }, author: req.adminId });
    const remaining = await Blog.countDocuments({ author: req.adminId });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} blog posts deleted. Remaining: ${remaining}`,
    });
  } catch (error) {
    console.error("Error bulk deleting blog posts:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle blog post status
const toggleBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if admin is the author
    if (blog.author.toString() !== req.adminId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own blog posts",
      });
    }

    blog.status = status;
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog post status updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Error toggling blog status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get blog statistics
// Publish all draft posts (for testing)
const publishAllDrafts = async (req, res) => {
  try {
    const result = await Blog.updateMany(
      { status: "draft" },
      { status: "published" }
    );
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} draft posts published`,
    });
  } catch (error) {
    console.error("Error publishing drafts:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBlogStats = async (req, res) => {
  try {
    const totalPosts = await Blog.countDocuments({ author: req.adminId });
    const publishedPosts = await Blog.countDocuments({ 
      author: req.adminId, 
      status: "published" 
    });
    const draftPosts = await Blog.countDocuments({ 
      author: req.adminId, 
      status: "draft" 
    });
    const totalViews = await Blog.aggregate([
      { $match: { author: req.adminId } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews[0]?.totalViews || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getPublicBlogPosts,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
  bulkDeleteBlogPosts,
  toggleBlogStatus,
  publishAllDrafts,
  getBlogStats,
}; 