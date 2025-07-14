const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/admin");
const connectDB = require("../config/db");

dotenv.config();
connectDB();
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const admin = new Admin({
      name: "Taha",
      email: "tahaasad709@gmail.com",
      password: "admin123",
    });
    await admin.save();
    console.log(`Admin Created! Name: ${admin.name} Email: ${admin.email}`);
    process.exit(0);
  })
  .catch((err) => console.error("Error in creating admin", err));
