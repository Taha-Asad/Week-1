const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
module.exports = mongoose.model("Admin", adminSchema);
