const express = require("express");

const userRouter = express.Router();
const { userRegistration, userHome, userLogin } = require("../controller/userController")

userRouter.get("/", userHome)

userRouter.post("/user-insert", userRegistration)
userRouter.post("/user-login", userLogin)

module.exports = userRouter;
