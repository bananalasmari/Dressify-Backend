const jwt = require("jsonwebtoken")
require("dotenv").config()


const protectRoute = async (req,res ,next)=>{
    try{
     let token = req.headers.token
     let decode = jwt.verify(token , process.env.SECRETKEY)
     req.user = decode.user
     next()



    }catch(err){

        res.status(404).json({name : err.name ,
        message: err.message,
    url : req.originalUrl})

    }
}

// const getToken = (user) => {
//     return jwt.sign(
//       {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         address: user.address,
//       },
     
//       {
       
//       }
//     );
//   };

  
module.exports =protectRoute