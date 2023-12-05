const express = require('express');
const { authenticateJWT } = require('../Middleware/authentication');
const {loginController, registerController, payController,getUserBills,otpGenerator,getEmails} = require('../controller/userController'); 
const {generateOrders,verifyPayment} = require('../controller/razorPayController');

const userRouter = express.Router();

userRouter.post('/login', loginController);
userRouter.post('/register', registerController);
userRouter.post('/generateOTP',otpGenerator);
userRouter.put('/pay/:id', authenticateJWT,payController); 
userRouter.get('/getUserBills/:userMail',authenticateJWT,getUserBills);
userRouter.get('/getEmails',authenticateJWT,getEmails);

userRouter.post("/orders", generateOrders);
userRouter.post("/verify", verifyPayment);


module.exports = userRouter; 