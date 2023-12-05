const {default: mongoose} = require('mongoose');

//bill id, bill title, user email, bill amount, bill gen date, bill due date, status;

const billSchema = new mongoose.Schema({
    billId: {type:String, required:true},
    billTitle: {type:String, required:true},
    userEmail: {type:String, required:true},
    billAmount: {type:Number, required:true},
    billGenDate: {type:Date, required:true},
    billDueDate: {type:Date, required:true},
    status: {type:String, required:true}
});

const billModel = mongoose.model('bill', billSchema);

module.exports = billModel;
