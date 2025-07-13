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

const resvRouter = express.Router();

resvRouter.post("/postReservations", postReservation);
resvRouter.put("/admin/reservations/:_id", reservationApproval);
resvRouter.post("/yourReservation", getUserReservation);
resvRouter.get("/admin/all-reservations", getAllReservation);
resvRouter.delete("/delete-userReservation", deleteUserReservtion);
resvRouter.delete("/admin/delete-reservation/:id", deleteAdminReservation);
resvRouter.delete("/admin/bulkDelete-reservation", bulkDeleteAdmin);
resvRouter.get("/filter", filterReservations);

module.exports = resvRouter;
