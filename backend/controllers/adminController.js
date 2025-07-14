const Admin = require("../models/admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Reservation = require("../models/reservation.js");

const adminLogin = async () => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(404)
        .json({ success: false, message: "All field are required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true, secure: true })
      .json({
        success: true,
        message: `Login Successfull ${admin.name}`,
        token,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const dashBoardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tommorrow = new Date(today);
    tommorrow.setDate(today.getDate() + 1);
    const totalToday = await Reservation.countDocuments({
      date: { $gte: today, $lt: tommorrow },
    });
    const approvedStats = await Reservation.countDocuments({
      status: "approved",
    });
    const rejectedStats = await Reservation.countDocuments({
      status: "rejected",
    });
    const upcoming = await Reservation.countDocuments({
      date: {
        $gte: tommorrow,
      },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalReservation: totalToday,
        approvedStats: approvedStats,
        rejectedStats: rejectedStats,
        upcoming: upcoming,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  adminLogin,
  dashBoardStats,
};
