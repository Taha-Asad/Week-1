const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Item name is required"],
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Prices are required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description of the item is requireed"],
      maxlength: [500, "The description can be 500 words long"],
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "The category of the item is required"],
      lowercase:true ,
      enum: [
        "breakfast",
        "lunch",
        "dinner",
        "coffee",
        "tea",
        "other-drinks",
        "chef-special",
        "seasonal",
      ],
    },
    type: {
      type: String,
      enum: ["regular", "drinks", "special"],
      required: [true, "Type of item is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Menu", menuSchema);
