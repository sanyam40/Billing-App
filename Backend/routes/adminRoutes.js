const express = require('express');
const { authenticateJWT } = require('../Middleware/authentication');
const {billCreation,updateBills,deleteBills,getAllBills} = require('../controller/adminController');

const adminRouter = express.Router();

adminRouter.post('/billCreation',authenticateJWT, billCreation);
adminRouter.put('/updateBills/:id',authenticateJWT,updateBills);
adminRouter.delete('/deleteBills/:id',authenticateJWT,deleteBills); 
adminRouter.get('/getAllBills',authenticateJWT,getAllBills);


module.exports = adminRouter;