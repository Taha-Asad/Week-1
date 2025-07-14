const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
const connectDB = require("./config/db.js");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 5000;

// App middle wares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173/", credentials: true }));
app.use(cookieParser());

// App Routes
const reservationRouter = require("./routes/reservationRoutes.js");
const menuRouter = require("./routes/menuRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");

// Admin Main Routes

app.use("/api/v1/admin", adminRouter);

// User Reservation Routes

app.use("/api/v1/user", reservationRouter);

// Admin Reservation Routes

app.use("/api/v1/admin", reservationRouter);

// Menu Routes

//User Menu Route
app.use("/api/v1/user", menuRouter);
// Admin Routes
app.use("/api/v1/admin", menuRouter);
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT} `.blue.underline.bgGreen);
});
app.get("/", (req, res) => {
  res.send("Hello EveryOne checking server");
});
