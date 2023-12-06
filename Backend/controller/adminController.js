const sendEmail = require('../Helper/mailer');
const billModel = require('../model/billModel');
const userModel = require('../model/userModel');
const v4=require('uuid').v4;

const billCreation = async (req, res) => {
    const {billTitle, userEmail, billAmount} = req.body;
    const uuid = v4();
    const billId = uuid.slice(0, 8);
    const billGenDate = new Date();
    const status = 'UNPAID';
    const billDueDate = new Date();
    billDueDate.setDate(billGenDate.getDate() + 7);

    try {
        const bill = await billModel.findOne({billId});
        if(bill) {
            return res.status(400).json({message: 'Bill already exists'});
        } else {
            const newBill = new billModel({billId, billTitle, userEmail, billAmount, billGenDate, billDueDate, status});
            await newBill.save();
            sendEmail(newBill.userEmail, 'Bill Generated', `Your bill has been generated for amount ${billAmount}. Please pay it on time to avoid any inconvenience. Thank you.`,);
            return res.status(200).json({message: 'Bill created successfully'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal error'});
    }
};

const updateBills= async(req,res)=>{
    const{id} = req.params;

    const {billTitle, userEmail, billAmount, status}=req.body
    try {
        const task=await billModel.findOneAndUpdate({ billId: id },
            {
            billTitle:billTitle,
            userEmail:userEmail,
            billAmount:billAmount,
            status:status
        }, 
        {new:true} 
        );
        if (!task) {
            res.status(404).json({message:"Task not found"})
        } else {
            res.status(200).json({message:"Task updated"})
        }
       } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server error'})
    }
}
const deleteBills= async(req,res)=>{
    const {id}=req.params;
    try {
        const task=await billModel.findOneAndDelete({billId:id});
        if (!task) {
            res.status(404).json({message:"Task not found"})
        } else {
            res.status(200).json({message:"Task deleted"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal Server error'})
    }
};

const getAllBills = async (req, res) => {
    try {
        const bills = await billModel.find();
        if(!bills){
            return res.status(400).json({message: 'No bills found'});
        }else{
            return res.status(200).json(bills);
        }
    } catch (error) {
        res.status(500).json({message: 'Internal error'});
    }
};

const getUserEmails=async(req,res)=>{
    try {
      const users = await userModel.find({userType:'USER'});
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      else {
        const emailList = users.map(user => user.userMail);
        res.status(200).json(emailList);
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal error' });
    }
  }
  

module.exports = {billCreation, updateBills, deleteBills, getAllBills,getUserEmails}

