const Admin=require('../models/admin')
const bcryptjs=require('bcryptjs')
const jwt = require('jsonwebtoken')

/*
create an admin account
*/
exports.signup=(req,res,next)=>{
    bcryptjs.hash(req.body.password,10)
    .then((hash)=>{
        const admin= new Admin({
            email:req.body.email,
            password:hash
        })
        admin.save().then((result)=>{
            res.status(200).json({
                message:'admin account created successfully',
                admin:result
            })
        }).catch((err)=>{
            res.json(500).json({
                message:err
            })
        })
    })
}

/*
login an admin with token
*/
exports.login=(req,res,next)=>{
    let fetchedAdmin;
    Admin.findOne({'email':req.body.email}).then((admin)=>{
        if(!admin){
            return res.status(401).json({
                message:'auth failed'
            })
        }
        fetchedAdmin=admin
        return bcryptjs.compare(req.body.password,admin.password)

    }).then(result => {
        if(!result){
            res.status(401).json({
                message:'auth failed'
            })
        }

        // if password is valid
        const token=jwt.sign(
            {email:fetchedAdmin.email,adminId:fetchedAdmin._id},
            'admin_secret_key',
            {expiresIn:"1h"});
            res.status(200).json({
                token:token,
                expiresIn:3600
            })

    })
    .catch(err=>{
        return res.status(401).json({
            message:'auth failed'
        })
    })
}