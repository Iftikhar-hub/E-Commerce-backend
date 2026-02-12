const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// const allowedOrigins = [
//     'http://localhost:5173',
//     'https://e-commerce-nu-five-82.vercel.app',
    
// ];

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://e-commerce-nu-five-82.vercel.app",
        "https://e-commerce-backend-production-6436.up.railway.app",
        "https://back-end-mocha-delta.vercel.app/"
        
        
     
    ],
    credentials: true,
   
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set("trust proxy", 1);


const connectDB = require("./dbConnection");
const userRouter = require("./app/routes/routes");


app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRouter);
app.use("/api/product", userRouter);
app.use(userRouter);


connectDB().then(() => {
    
    // app.listen(process.env.PORT || 8000, () => {
    //     console.log("Server is running on Port:", process.env.PORT || 8000);
    // });
});

module.exports = app;






