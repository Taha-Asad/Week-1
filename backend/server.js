const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
const connectDB = require("./config/db.js");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration for production
const corsOptions = {
  origin: NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'http://localhost:3000']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};


// App middlewares
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Security headers for production
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}

// App Routes
const reservationRouter = require("./routes/reservationRoutes.js");
const menuRouter = require("./routes/menuRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");
const blogRouter = require("./routes/blogRoutes.js");
const publicBlogRouter = require("./routes/publicBlogRoutes.js");
const contactRouter = require("./routes/contactRoutes.js");
const commentRouter = require("./routes/commentRoutes.js");

// Public Routes (no authentication)
app.use("/api/v1/blog", publicBlogRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/contact", contactRouter);

// User Routes (basic authentication)
app.use("/api/v1/user", reservationRouter);
app.use("/api/v1/user", menuRouter);

// Admin Routes (admin authentication required)
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin", reservationRouter);
app.use("/api/v1/admin", menuRouter);
app.use("/api/v1/admin/blog", blogRouter);
app.use("/api/v1/admin/contact", contactRouter);
app.use("/api/v1/admin/comments", commentRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "SkillifyZone API is running",
    version: "1.0.0",
    environment: NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use('/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port: ${PORT} in ${NODE_ENV} mode`.blue.underline.bgGreen);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error);
  process.exit(1);
});
