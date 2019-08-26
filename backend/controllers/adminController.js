const Admin=require('../models/admin')
const bcryptjs=require('bcryptjs')
const jwt = require('jsonwebtoken')
const SensorData = require('../models/sensorData')
const Answer = require('../models/answer')
const Post= require('../models/post')
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
            res.status(500).json({
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
                expiresIn:3600,
                userid:fetchedAdmin._id
            })

    })
    .catch(err=>{
        return res.status(401).json({
            message:'auth failed'
        })
    })
}



exports.getSensorData=(req,res,nex)=>{
    console.log('oooo',req.userData.userId)
    const projectId=req.params.id;
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedData;
    const SensorDataQuery = SensorData.find({'projectId':projectId})
    if (pageSize && currentPage) {
        SensorDataQuery.skip(pageSize*(currentPage-1))
      .limit(pageSize)
    }
    Post.find({'_id':projectId}).then(resl=>{
        // console.log('..',resl)
        if(resl[0].sensorList.length===0){
            // console.log('...',resl)

            res.status(201).json({
                message:'no sensor data was asked in this project'
            })
        }
        else{
            // console.log('....',res)

      
    SensorDataQuery.populate('userId').populate('projectId').then((data)=>{
        if(!data || data.length==0){
            return res.status(404).json({
                message:'no sensor data available yet'
            }).end()
        }
        console.log('tererere',data[0].projectId.creator,req.userData.userId)
        if(data[0].projectId.creator !== req.userData.userId){
            console.log('2')
            return res.status(404).json({
                message:'not authorized'
            }).end()
        }
        else{
        console.log('3')

        fetchedData=data
        // return SensorData.count()

        res.status(200).json({
                        message:'sensor data found',
                        sensorData:fetchedData,
                        sensorDataCount:count,
                    })
                }
    })
    // .then((count)=>{
    //     console.log('4')

    //     Answer.find({'projectId':projectId}).then((answers)=>{
    //         console.log('5')

    //         res.status(200).json({
    //             message:'sensor data found',
    //             sensorData:fetchedData,
    //             sensorDataCount:count,
    //             answers:answers
    //         })
    //     }).catch(err=>{
    //         res.status(500).json({
    //             message:'error fetching answers',
    //             err:err
    //         })
    //     })
    // })
    .catch(err=>{
        console.log('ppp',err)
        res.status(500).json({
            message:'error fetching sensor data',
            err:err
        })
    })
    }
    })
}