const express = require("express");
const router = express.Router();
const User = require('../models/user.models')
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const protectRoute = require("../util/protectRoute")
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


const transport = nodemailer.createTransport(sendgridTransport({
 auth:{
     api_key : "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"

 }


}))



router.post('/', async(req,res)=>{
    try{
const newUser =new User(req.body);
let hash = bcrypt.hashSync(req.body.password, 10);
    // console.log(hash);

    newUser.password = hash;
await newUser.save()
.then( newUser =>{
transport.sendMail({
    to:newUser.email,
    from:"dressify.sei@gmail.com",
    subject:"signup Succees",
    html:"<h1>Welcome to dressify website </h1>"

})
// User.pre("save", function(next , done){
//     console.log("pre save user")
//     let salt = bcrypt.genSaltSync()
//     let hash = bcrypt.hashSync(this.password,salt)
//     console.log(this.password)
//     this.password = hash
//     next()
// })
})
res.json({
    message:"thank you for creating new user"
    , user: newUser,
    success:true
})
    }catch(err){
        res.status(401).json({ name :err.name, 
        message: err.message ,
    url: req.originalUrl
})

    }
})


router.post('/login', async(req,res)=>{
    const { email, password} = req.body

     try{

     let user = await User.findOne({email:email})

     if(user == null )throw new Error ("this email i not in your db")
     if(!bcrypt.compareSync(password , user.password)) throw Error ('password is wrong')
     user.password = undefined
     let token = jwt.sign({_id:user._id},
        process.env.SECRETKEY,{
        // expiresIn :60*60*1000
        })
res.json({message : 'login success', token, userID: user._id})

     }catch(err){
    console.log("error ! login failed")
    res.status(401).json({name :err.name , 
    message : err.message,
url: req.originalUrl})
     }


})


router.get("/allusers",protectRoute, async(req,res)=>{

try{
const allUser = await User.find()
res.status(200).json({allUser})

}catch(err){
res.status(404).json({name : err.name ,
message: err.message,
url : req.originalUrl})
}

})


router.post('/reset-password',(req,res)=>{
//create random token
crypto.randomBytes(32,(err,buffer)=>{
    if(err){
        console.log(err)
    }
    const token = buffer.toString("hex")
    User.findOne({email:req.body.email})
    .then(user=> {
        if(!user){
        return res.status(422).json({error:"User does not exist with that email"})
}

user.resetToken = token
//reset their password until one hour
//valid for one hour
user.expireToken = Date.now()+ 3600000
user.save().then((result)=>{
transport.sendMail({
   to:user.email,
   from:"dressify.sei@gmail.com",
   subject:"Password Reset",
   html:`
   <p> You requested for password reset </p>
   <h5> click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password </h5>
   `
})
res.json({message: "check your email"})
})


})
})

})




router.post('/reset/:tokenid',(req,res)=>{
    console.log("reset password");
    // res.json({
    //     message:"new password"
    //     , password: newPassword,
    //     success:true
    // })
    const tokenID = req.params.tokenid;
    const newPassword = req.body.password //grab the password from the frontend
    const sentToken = req.params.tokenid // to save the token in the db
   

    let hash = bcrypt.hashSync(newPassword, 10);

    // user.password = hash;
    console.log(newPassword)
    console.log(hash)
const filter = { resetToken: sentToken };
const update = { password: hash };
User.findOneAndUpdate(filter, update)
.then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
        res.send("ERROR!!!");
    })
    // User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})//expire token should be grater then the now token
    // .then(user=>{
    //     if(!user){//is the user token expired 
    //         return res.status(422).json({error:"Try again session expired"})
    //     }

    
       
    //     // .then(hashedpassword=>{
    //     //    user.password = hashedpassword
    //     //    user.resetToken = undefined
    //     //    user.expireToken = undefined
    //        user.save().then((saveduser)=>{
    //            res.json({message:"password updated success"})
    //        })
    //     // })
    // }).catch(err=>{
    //     console.log(err)
    // })
})

router.put("/getUserDetails/:id",protectRoute, async(req,res,next) =>{

    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      const updatedUser = await user.findByIdAndUpdate(user.name,user.email, user.address)
      res.send({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        token: getToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  });


    // router.post("/update-profile",protectRoute,function(req,res,next){

    //     var id=req.body.user_id;
    //     //  var profilePic= req.file.path;
    //      User.findById(id,function(err,data){
     
    //     //   data.profileImage=profilePic?profilePic:data.profileImage;
         
    //         data.save()
    //           .then(doc=>{
    //              res.status(201).json({
    //                  message:"Profile Image Updated Successfully",
    //                  results:doc
    //              });
    //           })
    //           .catch(err=>{
    //               res.json(err);
    //           })
             
    //      });
     
    //  });

module.exports=router
