const express = require('express');
const { authenticateJWT, isAdmin } = require('../Middleware/authentication');
const {billCreation,updateBills,deleteBills,getAllBills,getUserEmails} = require('../controller/adminController');

const adminRouter = express.Router();

// Protected Routes Used in Admin Portal
adminRouter.post('/billCreation',authenticateJWT,isAdmin,billCreation);
adminRouter.put('/updateBills/:id',authenticateJWT,isAdmin,updateBills);
adminRouter.delete('/deleteBills/:id',authenticateJWT,isAdmin,deleteBills); 
adminRouter.get('/getAllBills',authenticateJWT,isAdmin,getAllBills);
adminRouter.get('/getEmails',authenticateJWT,isAdmin,getUserEmails);

module.exports = adminRouter;