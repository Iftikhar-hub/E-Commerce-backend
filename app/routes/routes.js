const express = require("express");

const userRouter = express.Router();
const { userRegistration, userHome, userLogin, userLogout, userProfile } = require("../controller/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/imageMiddleware");
const { uploadProduct } = require("../middleware/productMiddleware");
const { productInsertion, productList, productCheckout, invoiceRetrieval } = require("../controller/productController");

const { addToCart, getUserCart, removeFromCart, updateQuantity } = require("../controller/cartController");
const { sendMessage, sendEmail } = require("../controller/sendMesageContoller");


userRouter.get("/", userHome)
userRouter.post("/user-insert", upload.single('file'), userRegistration)

userRouter.post("/user-login", userLogin)
userRouter.post("/user-logout", userLogout)
userRouter.get("/me", authMiddleware, userProfile)

userRouter.post("/product-insert", uploadProduct.single('image'), productInsertion)

userRouter.get("/productDisplay", productList) 
userRouter.post('/create-checkout-session', productCheckout);
userRouter.get('/get-invoice/:sessionId', invoiceRetrieval);

userRouter.post("/cart/add", authMiddleware, addToCart);
userRouter.get("/cart", authMiddleware, getUserCart);
userRouter.post("/cart/remove", authMiddleware, removeFromCart);
userRouter.post("/cart/update", authMiddleware, updateQuantity);

userRouter.post("/send-email", sendMessage)
userRouter.post("/sendEmail", sendEmail)


module.exports = userRouter;
  