const express = require("express");
const {
  postReservation,
  reservationApproval,
  getUserReservation,
  getAllReservation,
  deleteUserReservtion,
  deleteAdminReservation,
  bulkDeleteAdmin,
  filterReservations,
} = require("../controllers/reservationController");
const adminAuth = require("../helper/adminAuth");

const resvRouter = express.Router();


//User
resvRouter.post("/postReservations", postReservation);
resvRouter.delete("/delete-userReservation", deleteUserReservtion);
resvRouter.post("/yourReservation", getUserReservation);
// Admin
resvRouter.put("/reservations/:_id", adminAuth ,reservationApproval);
resvRouter.get("/all-reservations", adminAuth ,getAllReservation);
resvRouter.delete("/delete-reservation/:id", adminAuth ,deleteAdminReservation);
resvRouter.delete("/bulkDelete-reservation", adminAuth ,bulkDeleteAdmin);
resvRouter.get("/filter", adminAuth ,filterReservations);

module.exports = resvRouter;
