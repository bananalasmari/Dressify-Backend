const express = require('express')
const app =express();
const PORT = 4000;
require('dotenv').config()
const cors = require ('cors'); // to connect with react
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB , {useUnifiedTopology: true  ,  useNewUrlParser: true},
    ()=> console.log('connect to MongoDB') )



app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", require("./routes/user.route"))

app.listen(PORT , ()=>console.log('listening on port'+PORT));
