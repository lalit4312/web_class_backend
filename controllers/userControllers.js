const userModel = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//1. creating user function
const createUser = async (req, res) => {
    //1. Get data drom the user(Fname,lname,email,password)
    console.log(req.body)
    //#.Destructuring
    const { firstName, lastName, email, password } = req.body;
    //2. validation 
    if (!firstName || !lastName || !email || !password) {
        return res.json({
            "Success": false,
            "message": "please enter all fields!"
        })
    }

    //Try-catch(error handeling)
    try {
        //check if the user is already exist

        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User Already Exists!"
            })
        }
        //Hasing/encrypr the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, randomSalt)

        //save the user in database
        const newUser = new userModel({
            //fields: values received from user
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword
        })

        //Actually save the user database
        await newUser.save()

        //send the success response
        res.json({
            "success": true,
            "message": "User Created Successfully"
        })


    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message": "internal server error!"
        })

    }


}

//2. login user function
const loginUser = async (req, res) => {
    //check incomming data
    console.log(req.body)

    //destructuring
    const { email, password } = req.body;



    //validation
    if (!email || !password) {
        return res.json({
            "Success": false,
            "message": "please enter all fields!"
        })
    }
    try {
        //1. find user , if not : stop the process
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.json({
                "success": false,
                "message": "user not found!"
            })
        }
        //2. compare the passeord, if not:stop the process
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.json({
                "success": false,
                "message": "Incorrect Password !"
            })
        }
        //3. generate JWT token
        //3.1 secret Decryption key(.env ma xa)
        const token = await jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        )
        //4. send the token, userDate, message to the user
        res.json({
            "success": true,
            "message": "Login Successfully",
            "token": token,
            "userData": user
        })



    } catch (e) {
        console.log(error)
        res.json({
            "success": false,
            "message": "Internal server error"
        })

    }
}



//exporting
module.exports = {
    createUser,
    loginUser,
}

//task
//Controller - Routes - Index.js
//(make a productController.js)
//(make a productRoutes.js)
//(Link to index.js)