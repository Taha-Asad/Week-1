const mongoose = require("mongoose");
const colors = require("colors");


const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`.green.bgWhite);
    } catch (error) {
        console.log(`Error connecting database: ${error.message}`.red.bgMagenta);
        process.exit(1);
    }
}

module.exports = connectDB