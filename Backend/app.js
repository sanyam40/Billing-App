const express = require('express');
const cors = require('cors');
const connection=require('./connection');
const userRouter=require('./routes/userRoutes')
const adminRouter=require('./routes/adminRoutes')
const app = express();

app.use(cors());
app.use(express.json());
connection();

app.use('/api',userRouter)
app.use('/api',adminRouter)

app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log(`Error starting server + ${error}`);
    }
    else {
        console.log(`Backend Server At Port No : ${process.env.PORT}`);
    }
});