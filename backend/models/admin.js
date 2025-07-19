const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: "default-admin.jpg"
  },
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
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  settings: {
    reservationLimit: {
      type: Number,
      default: 60,
      min: 1
    },
    notifyOnReservation: {
      type: Boolean,
      default: true
    },
    notifyOnApproval: {
      type: Boolean,
      default: true
    },
    notificationEmail: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  // Skip hashing if password is already hashed (starts with $2b$)
  if (this.password && this.password.startsWith('$2b$')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);