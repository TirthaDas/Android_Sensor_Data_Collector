const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1];
        const decodedToken=jwt.verify(token,'admin_secret_key');
        console.log("decoded token$$$$$$$$$$$",decodedToken)
        req.userData={email:decodedToken.email,userId:decodedToken.adminId}
        next()
        
    } catch (error) {
        res.status(401).json({
            message:'auth failed'
        })
    }
}