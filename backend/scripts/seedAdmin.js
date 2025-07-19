const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const connectDB = require("../config/db");

dotenv.config();

// Configure exit handlers
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "tahaasad709@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists:");
      console.log(`Name: ${existingAdmin.name}`);
      console.log(`Email: ${existingAdmin.email}`);
      return process.exit(0);
    }

    // Create admin (password will be hashed by the pre-save hook)
    const admin = new Admin({
      profileImage: "default-admin.jpg",
      name: "Taha",
      email: "tahaasad709@gmail.com",
      password: "admin123",
      settings: {
        reservationLimit: 60,
        notifyOnReservation: true,
        notifyOnApproval: true,
        notificationEmail: "tahaasad709@gmail.com"
      }
    });

    // Save admin
    await admin.save();
    console.log("Admin created successfully:");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

// Execute the function
createAdmin();