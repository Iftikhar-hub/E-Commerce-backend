const express = require("express");



// module.exports = { cloudinary }; 

const userRouter = express.Router();
const { userRegistration, userHome, userLogin, userLogout, userProfile } = require("../controller/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/imageMiddleware");
const { uploadProduct } = require("../middleware/productMiddleware");
const { productInsertion } = require("../controller/productController");

userRouter.get("/", userHome)
userRouter.post("/user-insert", upload.single('file'), userRegistration)

userRouter.post("/user-login", userLogin)
userRouter.post("/user-logout", userLogout)
userRouter.get("/me", authMiddleware, userProfile)

userRouter.post("/product-insert", uploadProduct.single('image') , productInsertion)


module.exports = userRouter;
  