const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    reservationID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name!"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [30, "Name cannot be more than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email!"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please Provide a valid email!"],
    },
    phoneNo: {
      type: String,
      required: [true, "Please provide valid phone number"],
      trim: true,
      match: [/^\d{11}$/, "Phone number must be of 11 digits"],
    },
    noOfPeople: {
      type: Number,
      required: true,
      trim: true,
      min: [1, "At least one person needs to be present"],
      max: [15, "Please contact us directly for large reservations"],
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      trim: true,
      required: true,
    },
    duration: {
      type: Number,
      trim: true,
      enum: 60,
      default: 30,
    },
    message: {
      type: String,
      maxlength: [500, "If you have a message for us?"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
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

module.exports = mongoose.model("Reservation", reservationSchema);
