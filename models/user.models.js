const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true,
        default: "customer"
    },
    username:{
        type: String,
        unique: true
    },
    profileImage: {
        type: String
    },
    bio:{
        type: String,
        default: "Hi i'm new here!"
    },
    itemsSold: {
        type: Number,
        default: 0
    }
,
resetToken:String,
expireToken:Date,
 
},{timestmp : true})

userSchema.pre("save", function(next , done){
    console.log("pre save user")
    let salt = bcrypt.genSaltSync()
    let hash = bcrypt.hashSync(this.password,salt)
    this.password = hash
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User;
