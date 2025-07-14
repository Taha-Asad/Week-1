const express = require("express");
const upload = require("../utils/multer.js");
const {
  postMenuItem,
  getMenuItem,
  getMenuItemById,
  deleteMenuItem,
  deleteMenu,
  updateMenuItem,
} = require("../controllers/menuController.js");
const adminAuth = require("../helper/adminAuth.js");
const menuRouter = express.Router();

//User
menuRouter.get("/menu", getMenuItem);
//Admin
menuRouter.post(
  "/postMenuItem",
  adminAuth,
  upload.single("image"),
  postMenuItem
);
menuRouter.get("/menu/:id", adminAuth, getMenuItemById);
menuRouter.delete("/delete-menu/:id", adminAuth, deleteMenuItem);
menuRouter.delete("/menu-bulkDelete", adminAuth, deleteMenu);
menuRouter.patch(
  "/update-menu/:id",
  adminAuth,
  upload.single("image"),
  updateMenuItem
);

module.exports = menuRouter;
