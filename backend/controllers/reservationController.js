const { getDateTimeObject } = require("../helper/dateTime.js");
const Reservation = require("../models/reservation.js");
const { SendEmail } = require("../config/nodeMailer.js");
const MAX_CAP = 60;
const postReservation = async (req, res) => {
  try {
    const { name, email, phoneNo, noOfPeople, date, time, message } = req.body;
    if (!name || !email || !phoneNo || !noOfPeople || !date || !time) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide all fields" });
    }

    const startTime = getDateTimeObject(date, time);
    const endTime = new Date(startTime.getTime() + 60 * 60000);

    const now = new Date();
    if (startTime < now) {
      return res
        .status(400)
        .json({ success: false, message: "Can not make reservation in past" });
    }
    const reservations = await Reservation.find({ date: new Date(date) });

    let totalPeopleDuringSlot = 0;
    for (let resv of reservations) {
      const existingStart = getDateTimeObject(resv.date, resv.time);
      const existingEnd = new Date(existingStart.getTime() + 60 * 60000);
      const overlap = startTime < existingEnd && endTime > existingStart;
      if (overlap) {
        totalPeopleDuringSlot += resv.noOfPeople;
      }
    }
    if (totalPeopleDuringSlot + noOfPeople > MAX_CAP) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already full. Please try another time.",
      });
    }
    const generateReservationID = () => {
      const prefix = "RSV-";
      const numberGenerator = Math.floor(100000 + Math.random() * 900000);
      return prefix + numberGenerator;
    };
    const newReservation = new Reservation({
      name,
      email,
      phoneNo,
      noOfPeople,
      date,
      time,
      duration: 60,
      message,
      reservationID: generateReservationID(),
    });

    await newReservation.save();

    return res.status(201).json({
      success: true,
      message:
        "Thanks for your reservation request! Our team is reviewing it, and you’ll receive a confirmation email within 10 to 15 minutes",
      reservation: newReservation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const reservationApproval = async (req, res) => {
  try {
    const { _id } = req.params;
    const { status, note } = req.body;
    const reservation = await Reservation.findById({
      _id,
    });
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "No reservation found" });
    }
    reservation.status = status;
    await reservation.save();
    if (status === "approved") {
      await SendEmail(
        reservation.email,
        "Reservation confirmed",
        "reservationApproved",
        {
          name: reservation.name,
          date: reservation.date.toDateString(),
          time: reservation.time,
          reservationID: reservation.reservationID,
        }
      );
    }
    if (status === "rejected") {
      await SendEmail(
        reservation.email,
        "Reservation rejected",
        "reservationRejected",
        {
          name: reservation.name,
          date: reservation.date.toDateString(),
          time: reservation.time,
          note:
            note ||
            "We couldn't accommodate your request at this time. Please try another slot.",
        }
      );
    }
    return res.status(200).json({
      success: true,
      message: "Successfully updated status",
      reservation: reservation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserReservation = async (req, res) => {
  try {
    const { reservationID } = req.body;
    const reservation = await Reservation.findOne({
      reservationID: reservationID,
    });
    if (!reservation) {
      res.status(404).json({ success: false, message: "No reservation found" });
      return;
    }
    return res.status(200).json({
      success: true,
      message: "Reservation found",
      reservation: {
        status: reservation.status,
        reservationID: reservation.reservationID,
        name: reservation.name,
        email: reservation.email,
        phoneNo: reservation.phoneNo,
        noOfPeople: reservation.noOfPeople,
        date: reservation.date,
        time: reservation.time,
        duration: reservation.duration,
        message: reservation.message,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getAllReservation = async (req, res) => {
  try {
    const reservation = await Reservation.find().sort({ date: 1 });

    const count = await Reservation.countDocuments();

    return res.status(200).json({
      success: true,
      message: `Total reservation: ${count}`,
      reservation: reservation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deleteUserReservtion = async (req, res) => {
  try {
    const { reservationID } = req.body;

    const reservation = await Reservation.findOne({
      reservationID: reservationID,
    });
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    if (reservation.status === "approved") {
      return res.status(403).json({
        success: false,
        message:
          "Your reservation has already been approved. To cancel it, please contact the café directly.",
      });
    }
    await reservation.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Reservation deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAdminReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res
        .status(400)
        .json({ success: false, message: "No reservation found by this id" });
    }
    await reservation.deleteOne();
    const count = await Reservation.countDocuments();
    return res.status(200).json({
      success: true,
      message: `Reservation deleted successfully! \n Remaining Reservation: ${count}`,
      reservation: reservation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const bulkDeleteAdmin = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Provide Array of ids" });
    }

    const result = await Reservation.deleteMany({ _id: { $in: ids } });
    const remaining = await Reservation.countDocuments();

    return res.status(200).json({
      success: true,
      message: ` ${result.deletedCount} reservation deleted Remaining Reservations: ${remaining}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const filterReservations = async (req, res) => {
  try {
    const { status, date, from, to, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = {
        $gte: start,
        $lt: end,
      };
    }
    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lt: new Date(to),
      };
    }
    const skip = (page - 1) * limit;
    const reservation = await Reservation.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Reservation.countDocuments(query);
    return res.status(200).json({
      success: true,
      message: `Page: ${page} of reservations`,
      reservation,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  postReservation,
  reservationApproval,
  getUserReservation,
  getAllReservation,
  deleteUserReservtion,
  deleteAdminReservation,
  bulkDeleteAdmin,
  filterReservations,
};
