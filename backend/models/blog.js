const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      minlength: [50, "Content must be at least 50 characters"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    image: {
      type: String,
      default: "default-blog.jpg",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published", // Changed default to published
    },
    tags: [{
      type: String,
      trim: true,
    }],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    readTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title before saving
blogSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  
  // Calculate read time (average 200 words per minute)
  const wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / 200);
  
  next();
});

// Generate excerpt from content if not provided
blogSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + "...";
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema); 