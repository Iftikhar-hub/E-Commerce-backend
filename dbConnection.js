const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("Database successfully Connected");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        
    }
};

module.exports = connectDB;
