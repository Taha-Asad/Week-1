const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const colors = require("colors");
const connectDB = require("./config/db.js");




const app = express();


const PORT = process.env.PORT || 5000;

// App middle wares

app.listen(PORT , ()=>{ 
    console.log(`Server is running on Port: ${PORT} `.blue.underline.bgGreen)
    connectDB();
})