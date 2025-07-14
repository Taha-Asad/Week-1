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
const menuRouter = express.Router();

menuRouter.post("/postMenuItem", upload.single("image"), postMenuItem);
menuRouter.get("/menu", getMenuItem);
menuRouter.get("/menu/:id", getMenuItemById);
menuRouter.delete("/delete-menu/:id", deleteMenuItem);
menuRouter.delete("/menu-bulkDelete", deleteMenu);
menuRouter.patch("/update-menu/:id", upload.single("image"), updateMenuItem);

module.exports = menuRouter;
