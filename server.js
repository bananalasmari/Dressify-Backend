const express = require('express')
const app =express();
const PORT = 4000;
require('dotenv').config()
const cors = require ('cors'); // to connect with react
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

 


mongoose.connect(process.env.MONGODB , {useUnifiedTopology: true  ,  useNewUrlParser: true, useFindAndModify: false },
    ()=> console.log('connect to MongoDB') )



 
const itemRoutes = require('./routes/item');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
 
app.use('/api',itemRoutes);
app.use('/api',cartRoutes);
app.use('/api',orderRoutes);



app.use("/api/v1/user", require("./routes/user.route"))



app.listen(PORT , ()=>console.log('listening on port'+PORT));
