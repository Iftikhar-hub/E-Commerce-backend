const express = require("express");

const userRouter = express.Router();
const { userRegistration, userHome, userLogin, userLogout, userProfile } = require("../controller/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

userRouter.get("/", userHome)

userRouter.post("/user-insert", userRegistration)
userRouter.post("/user-login", userLogin)
userRouter.post("/user-logout", userLogout)
userRouter.get("/me",authMiddleware,userProfile)
module.exports = userRouter;
