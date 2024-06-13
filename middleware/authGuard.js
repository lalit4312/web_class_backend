const jwt=require('jsonwebtoken')

const authGuard=(req,res,next)=>{
    // #. check incomming data
    console.log(req.headers);
    // 1. get auth headers(content type, authorization ...)
    // 2. Get 'authorization'
    const authHeader=req.headers.authorization;
    // 3. if not found stop the process(res)
    if(!authHeader){
        return res.status(400).json({
            success:false,
            message:'Authorization header not found!'
        })
    }
    // 4. authorization format:' Bearer tokensdfgdfghj'
    // 5. get only the token by splitting by space (0-Bearer, 1-token)
    const token=authHeader.split(' ')[1]
    // 6. if token not found or mismatch(stop the process, res)
    if(!token||token===''){
        return res.status(400).json({
            success:false,
            message:'Token is missing!'
        })
    }
    // 7 . verify the token
    // 8. if verifird, next
    // 9. not:not authenticated

    try {

        // verify the token and get user information
        const decodedUser=jwt.verify(token, process.env.JWT_SECRET)
        req.user=decodedUser;
        next()

        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            mesage:'Not Authenticated!'
            
        })
        
    }
}



// admin Guard
const adminGuard=(req,res,next)=>{
    // #. check incomming data
    console.log(req.headers);
    // 1. get auth headers(content type, authorization ...)
    // 2. Get 'authorization'
    const authHeader=req.headers.authorization;
    // 3. if not found stop the process(res)
    if(!authHeader){
        return res.status(400).json({
            success:false,
            message:'Authorization header not found!'
        })
    }
    // 4. authorization format:' Bearer tokensdfgdfghj'
    // 5. get only the token by splitting by space (0-Bearer, 1-token)
    const token=authHeader.split(' ')[1]
    // 6. if token not found or mismatch(stop the process, res)
    if(!token||token===''){
        return res.status(400).json({
            success:false,
            message:'Token is missing!'
        })
    }
    // 7 . verify the token
    // 8. if verifird, next
    // 9. not:not authenticated

    try {

        // verify the token and get user information
        const decodedUser=jwt.verify(token, process.env.JWT_SECRET)
        req.user=decodedUser;

        // check if the user is admin or not
        if(!req.user.isAdmin){
            return res.status(400).json({
                success:false,
                message:'Premission Denied!'
            })
        }

        next()

        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            mesage:'Not Authenticated!'
            
        })
        
    }
}



module.exports={
    authGuard,
    adminGuard
}