const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const connectDB = require("./dbConnection");
const userRouter = require("./app/routes/routes");


app.use(express.urlencoded({ extended: true }));
app.use("/api/user",userRouter);

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is running on Port:", process.env.PORT || 8000);
    });
});



