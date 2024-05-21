//write a function
//importing packages
//always export the function

//1. importing the packages
const mongoose = require('mongoose')

//2. creating a function
const connectDB = () => {
    mongoose.connect(process.env.MONGODB_CLOUDURL).then(() => {
        console.log("database Connected Successfully")
    })
}


//3. exporting the function
module.exports = connectDB;