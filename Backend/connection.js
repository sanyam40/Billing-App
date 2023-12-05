const{default:mongoose}=require('mongoose');

const url="mongodb+srv://sanyam:0721@cluster0.cuvuh8j.mongodb.net/BillingBackend?retryWrites=true&w=majority";

const connection=()=>{
    mongoose.connect(url).then(()=>{
        console.log("Connection successful");
    }).catch((error)=>{
        console.log("Connection unsuccessful");
    })
}

module.exports=connection;