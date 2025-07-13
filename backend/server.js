const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
const connectDB = require("./config/db.js");
const morgan = require("morgan");
const cors = require("cors")


const app = express();


const PORT = process.env.PORT || 5000;

// App middle wares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({origin: "http://localhost:5173/" , credentials:true}));

// App Routes
const reservationRouter = require("./routes/reservationRoutes.js")

// User Reservation Routes

app.use("/api/v1/user" , reservationRouter );

// Admin Reservation Routes

app.use("/api/v1" , reservationRouter );

connectDB();
app.listen(PORT , ()=>{ 
    console.log(`Server is running on Port: ${PORT} `.blue.underline.bgGreen)
})
app.get("/", (req, res) => {
  res.send("Hello EveryOne checking server");
});