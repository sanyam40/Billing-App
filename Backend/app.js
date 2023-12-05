const express = require('express');
const cors = require('cors');
const connection=require('./connection');
const userRouter=require('./routes/userRoutes')
const adminRouter=require('./routes/adminRoutes')
const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());
connection();

app.use('/api',userRouter)
app.use('/api',adminRouter)

app.listen(5000, (error) => {
    if (error) {
        console.log("error starting server");
    }
    else {
        console.log("server started at port 5000");
    }
});