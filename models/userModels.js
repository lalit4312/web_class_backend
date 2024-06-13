const mongoose = require('mongoose');
const { use } = require('../routes/userRoutes');

//Making schema
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});
const User=mongoose.model('user',userSchema)
module.exports=User;