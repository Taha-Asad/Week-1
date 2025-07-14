const express = require("express");
const {
  adminLogin,
  dashBoardStats,
} = require("../controllers/adminController");
const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/dashBoard-stats", dashBoardStats);

module.exports = adminRouter;
