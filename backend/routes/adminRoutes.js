const express = require("express");
const {
  adminLogin,
  getAdminSettings,
  getDashboardStats,
  updateAdminSettings,
} = require("../controllers/adminController");
const upload = require("../utils/multer.js");
const adminAuth = require("../helper/adminAuth.js");
const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/dashboard-stats", adminAuth, getDashboardStats);
adminRouter.get("/settings", adminAuth, getAdminSettings);
adminRouter.put("/settings", adminAuth, upload.single("profileImage"), updateAdminSettings);

module.exports = adminRouter;