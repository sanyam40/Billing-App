require('dotenv').config();
const userModel = require('../model/userModel');
const secretKey = process.env.SECRET_KEY;
const encryptPassword = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');

var otp = 0;

const otpGenerator = async (req, res) => {
  try {
    const { userMail } = req.body;
    otp = Math.floor(Math.random() * 1000000);
    sendEmail(userMail, 'OTP', `Your OTP is ${otp} valid for 3 minutes`);
    res.status(200).json({ message: 'OTP generated', otp: otp });
    setTimeout(() => {
      otp = null;
    }, 3 * 60 * 1000);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal error' });
  }
}

const adminLogin = async (req, res) => {
    try {
      const { userMail, userPassword } = req.body;
      const admin = await userModel.findOne({ userMail });
  
      if (!admin || admin.userType !== 'ADMIN') {
        return res.status(400).json({ message: 'Invalid admin credentials' });
      }
  
      const isPasswordValid = encryptPassword.matchPwd(userPassword, admin.userPassword);
      if (isPasswordValid) {
        const payload={email:admin.email,id:admin._id,role:admin.userType};
        const token=jwt.sign(payload, secretKey, { expiresIn: '1h' });
        return res.status(200).json({
          message: 'Admin login successful',
          token,
        });
      } else {
        return res.status(400).json({
          message: 'Invalid admin credentials',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal error' });
    }
  };
  
  const userLogin = async (req, res) => {
    try {
      const { userMail, userPassword } = req.body;
      const user = await userModel.findOne({ userMail });
  
      if (!user || user.userType !== 'USER') {
        return res.status(400).json({ message: 'Invalid user credentials' });
      }
      const isPasswordValid = encryptPassword.matchPwd(userPassword, user.userPassword);
      if (isPasswordValid) {
        const payload={email:user.email,id:user._id,role:user.userType};
        const token=jwt.sign(payload, secretKey, { expiresIn: '1h' });
        return res.status(200).json({
          message: 'User login successful',
          token,
        });
      } else {
        return res.status(400).json({
          message: 'Invalid User credentials',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal error' });
    }
  };
  
  const loginController = async (req, res) => {
    try {
      const { userMail, userPassword, userType } = req.body;
      const user = await userModel.findOne({ userMail });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isPasswordValid = encryptPassword.matchPwd(userPassword, user.userPassword);
      if (isPasswordValid) {
        if (userType === 'ADMIN') {
          return adminLogin({ ...req, body: { ...req.body, userType } }, res);
        } else {
          return userLogin({ ...req, body: { ...req.body, userType } }, res);
        }
      }
      else {
        return res.status(400).json({
          message: 'Invalid credentials'
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    };
  };
  
  const registerController = async (req, res) => {
    try {
      const { userMail, userPassword, userType, userOTP } = req.body;
      const hashedPwd = encryptPassword.hasPwd(userPassword);
  
      const exist = await userModel.findOne({ userMail });
  
      if (otp != userOTP) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      if (!exist) {
        const user = await userModel.create({
          userMail: userMail,
          userPassword: hashedPwd,
          userType: userType,
        });
        if (user) {
          res.status(200).json({
            message: 'Registration successful'
          });
        }
        else {
          res.status(400).json({
            message: 'Registration failed'
          });
        }
      }
      else {
        res.status(400).json({
          message: 'User already exists'
        });
      }
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.userMail) {
        res.status(400).json({ message: 'UserMail already exists' });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Internal error' });
      }
    }
  };

module.exports = { loginController, registerController,otpGenerator };