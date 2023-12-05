const {default: mongoose} = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: false },
    userMail: { type: String, required: true, unique: true, index: true },
    userPassword: { type: String, required: true },
    userType:{ type:String,required:true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;