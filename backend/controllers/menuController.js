const Menu = require("../models/menu.js");
const fs = require("fs");
const path = require("path");
const postMenuItem = async (req, res) => {
  try {
    const { name, description, price, type, category  } = req.body;
    if (!name || !description || !price || !type || !category) {
      return res
        .status(404)
        .json({ success: false, message: "All field are required!" });
    }
    const image = req.file ? req.file.filename : null;
    const newMenuItem = new Menu({
      name,
      description,
      price,
      image,
      category,
      type,
    });
    await newMenuItem.save();
    res
      .status(201)
      .json({ success: true, message: "Food Item added successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMenuItem = async (req, res) => {
  try {
    const { category, type } = req.query;
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    const item = await Menu.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Item fetched succesffully",
      menu: item,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    const count = await Menu.countDocuments();
    return res.status(200).json({
      success: true,
      message: `Item fetched successfully, Total Items ${count}`,
      menu: menuItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    await menuItem.deleteOne();
    if (menuItem.image) {
      const imagePath = path.join(__dirname, "..", "uploads", menuItem.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image file:", err);
        }
      });
    }
    const count = await Menu.countDocuments();
    return res.status(200).json({
      success: true,
      message: `Successfully deleted the menu item! Remaining items: ${count}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deleteMenu = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array is empty or ids are not in array format",
      });
    }
    const menuItem = await Menu.find({ _id: { $in: ids } });
    menuItem.forEach((item) => {
      if (item.image) {
        const imagePath = path.join(__dirname, "..", "uploads", item.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Failed to delete image for item ${item._id}:`, err);
          }
        });
      }
    });
    const result = await Menu.deleteMany({ _id: { $in: ids } });
    const remaining = await Menu.countDocuments();
    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} Selected food item deleted Successfully. Remaining Items: ${remaining}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "No item found by this id" });
    }
    if (menuItem.image) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        menuItem.image
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image", err);
        }
      });
      menuItem.image = req.file.filename;
    }
    const fieldsToUpdate = [
      "name",
      "description",
      "price",
      "category",
      "type",
    ];
    fieldsToUpdate.forEach((fields) => {
      if (req.body[fields]) {
        menuItem[fields] = req.body[fields];
      }
    });
    return res
      .status(200)
      .json({ success: true, message: "Item updated successfully", menuItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  postMenuItem,
  getMenuItem,
  getMenuItemById,
  deleteMenuItem,
  deleteMenu,
  updateMenuItem,
};
