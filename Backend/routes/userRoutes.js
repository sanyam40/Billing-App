const express = require('express');
const { authenticateJWT, isUser } = require('../Middleware/authentication');
const { payController,getUserBills, generateOrders, verifyPayment} = require('../controller/userController'); 
const { loginController, registerController, otpGenerator } = require('../controller/loginController');

const userRouter = express.Router();

// Public Routes ( Used on Home Page )
userRouter.post('/login', loginController);
userRouter.post('/register', registerController);
userRouter.post('/generateOTP',otpGenerator);

// Protected Routes
userRouter.put('/pay/:id', authenticateJWT,isUser,payController); 
userRouter.get('/getUserBills/:userMail',authenticateJWT,isUser,getUserBills);

// RazorPay Routes
userRouter.post("/orders",authenticateJWT,isUser, generateOrders);
userRouter.post("/verify",authenticateJWT,isUser, verifyPayment);

module.exports = userRouter; 