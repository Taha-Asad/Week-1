const Admin = require("../models/admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Reservation = require("../models/reservation.js");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { SendEmail } = require("../config/nodeMailer.js");
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    if (!email || !password) {
      return res
        .status(404)
        .json({ success: false, message: "All field are required" });
    }
    const admin = await Admin.findOne({ email }).select("+password");
    console.log('Admin found:', admin ? 'Yes' : 'No');
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    console.log('Password hash exists:', admin.password ? 'Yes' : 'No');
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch);
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


const getDashboardStats = async (req, res) => {
  try {
    const { timeRange, startDate, endDate } = req.query;
    let dateFilter = {};
    const today = new Date();

    if (timeRange === "today") {
      dateFilter = {
        date: {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lte: new Date(today.setHours(23, 59, 59, 999))
        }
      };
    } else if (timeRange === "week") {
      const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
      dateFilter = {
        date: {
          $gte: new Date(firstDay.setHours(0, 0, 0, 0)),
          $lte: new Date()
        }
      };
    } else if (timeRange === "month") {
      dateFilter = {
        date: {
          $gte: new Date(today.getFullYear(), today.getMonth(), 1),
          $lte: new Date()
        }
      };
    } else if (timeRange === "year") {
      dateFilter = {
        date: {
          $gte: new Date(today.getFullYear(), 0, 1),
          $lte: new Date()
        }
      };
    } else if (timeRange === "custom" && startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Get counts
    const totalReservation = await Reservation.countDocuments(dateFilter);
    const approvedStats = await Reservation.countDocuments({
      ...dateFilter,
      status: "approved",
    });
    const rejectedStats = await Reservation.countDocuments({
      ...dateFilter,
      status: "rejected",
    });
    const pendingStats = await Reservation.countDocuments({
      ...dateFilter,
      status: "pending",
    });

    // Get upcoming reservations (future dates)
    const upcoming = await Reservation.countDocuments({
      date: { $gt: new Date() },
    });

    // Generate trend data (example for month)
    const trendData = await Reservation.aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          reservations: "$count",
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalReservation,
        approvedStats,
        rejectedStats,
        pendingStats,
        upcoming,
      },
      reservationTrend: trendData,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard statistics",
    });
  }
};

const getAdminSettings = async (req, res) => {
  try {
    console.log('Admin ID from token:', req.adminId);
    const admin = await Admin.findById(req.adminId).select("-password");
    console.log('Admin found:', admin);
    
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    
    const responseData = {
      name: admin.name,
      email: admin.email,
      profileImage: admin.profileImage,
      settings: admin.settings || {
        reservationLimit: 60,
        notifyOnReservation: true,
        notifyOnApproval: true,
        notificationEmail: admin.email, // Add notification email field
      },
    };
    
    console.log('Admin settings response:', responseData);
    console.log('Profile image in response:', responseData.profileImage);
    
    console.log('Sending response:', responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in getAdminSettings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAdminSettings = async (req, res) => {
  try {
    console.log('Update settings request body:', req.body);
    const {
      name,
      email,
      currentPassword,
      newPassword,
      notificationEmail,
      ...settings
    } = req.body;
    const admin = await Admin.findById(req.adminId).select("+password");
    console.log('Admin found for update:', admin ? 'Yes' : 'No');

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (notificationEmail) admin.settings.notificationEmail = notificationEmail;

    if (currentPassword && newPassword) {
      console.log('Password change requested');
      console.log('Current password provided:', currentPassword ? 'Yes' : 'No');
      console.log('Admin password hash exists:', admin.password ? 'Yes' : 'No');
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      // Hash the new password manually to avoid double-hashing
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
      console.log('New password hashed successfully');
    }

    if (req.file) {
      console.log('File uploaded:', req.file);
      if (admin.profileImage && admin.profileImage !== 'default-admin.jpg') {
        try {
          fs.unlinkSync(path.join(__dirname, "../uploads", admin.profileImage));
          console.log('Old profile image deleted');
        } catch (error) {
          console.log('Error deleting old image:', error.message);
        }
      }
      admin.profileImage = req.file.filename;
      console.log('New profile image set:', req.file.filename);
    }

    // Prepare update data
    const updateData = {
      name: admin.name,
      email: admin.email,
      settings: {
        ...admin.settings,
        reservationLimit: parseInt(settings.reservationLimit) || 60,
        notifyOnReservation:
          settings.notifyOnReservation === "true" ||
          settings.notifyOnReservation === true,
        notifyOnApproval:
          settings.notifyOnApproval === "true" ||
          settings.notifyOnApproval === true,
      }
    };

    // If password was changed, add it to update data
    if (currentPassword && newPassword) {
      updateData.password = admin.password; // Already hashed
    }

    // If profile image was uploaded, add it to update data
    if (req.file) {
      updateData.profileImage = req.file.filename;
      console.log('Profile image updated to:', req.file.filename);
    }

    // Use findByIdAndUpdate to avoid pre-save hook
    await Admin.findByIdAndUpdate(req.adminId, updateData, { new: true });
    
    // Clear reservation limit cache to ensure fresh data
    if (global.reservationLimitCache) {
      global.reservationLimitCache = null;
      global.cacheTimestamp = null;
    }
    
    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error('Error in updateAdminSettings:', error);
    res.status(500).json({ message: error.message });
  }
};

const sendReservationNotification = async (adminId, reservation, type) => {
  try {
    console.log('Sending notification:', { adminId, reservationId: reservation._id, type });
    
    // Get admin with default settings if none exist
    const admin = await Admin.findById(adminId).lean();
    
    if (!admin) {
      console.error("Admin not found for notification:", adminId);
      return;
    }

    // Ensure settings exist with defaults
    const adminWithSettings = {
      ...admin,
      settings: admin.settings || {
        reservationLimit: 60,
        notifyOnReservation: true,
        notifyOnApproval: true,
        notificationEmail: admin.email
      }
    };

    // Check if notifications are enabled for this type
    const shouldNotify = type === "new" 
      ? adminWithSettings.settings.notifyOnReservation
      : adminWithSettings.settings.notifyOnApproval;

    if (!shouldNotify) {
      console.log('Notifications disabled for this type');
      return;
    }

    const templatePath = path.join(
      __dirname,
      "../views/reservation-notification.ejs"
    );
    
    // Ensure template exists
    if (!fs.existsSync(templatePath)) {
      throw new Error('Email template not found');
    }

    const template = fs.readFileSync(templatePath, "utf-8");
    
    // Prepare data for template
    const templateData = {
      admin: adminWithSettings,
      reservation: {
        _id: reservation._id,
        userName: reservation.name || 'Customer',
        date: reservation.date ? new Date(reservation.date).toLocaleDateString() : 'N/A',
        timeSlot: reservation.time || 'N/A',
        status: reservation.status || 'pending'
      },
      notificationType: type
    };

    const html = ejs.render(template, templateData);

    const emailTo = adminWithSettings.settings.notificationEmail || adminWithSettings.email;
    
    if (!emailTo) {
      throw new Error('No email address found for notification');
    }

    await SendEmail(
      emailTo,
      type === "new"
        ? `New Reservation: ${reservation._id}`
        : `Reservation Update: ${reservation._id}`,
      "reservation-notification",
      templateData
    );

    console.log('Notification email sent successfully');
  } catch (error) {
    console.error("Error sending notification email:", error.message);
    // Consider adding error tracking here
  }
};
module.exports = {
  adminLogin,
  getAdminSettings,
  getDashboardStats,
  updateAdminSettings,
  sendReservationNotification
};
