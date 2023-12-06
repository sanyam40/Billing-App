const{default:mongoose}=require('mongoose');

const url=process.env.MONGO_URL || "mongodb+srv://sanyam:0721@cluster0.cuvuh8j.mongodb.net/BillingBackend?retryWrites=true&w=majority"; 

const connection=()=>{
    mongoose.connect(url).then(()=>{
        console.log("Connection successful to MongoDB");
    }).catch((error)=>{
        console.log("Connection unsuccessful");
    })
}

module.exports=connection;