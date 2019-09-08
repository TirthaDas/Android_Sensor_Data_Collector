const Admin = require('../models/admin')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SensorData = require('../models/sensorData')
const Answer = require('../models/answer')
const Post = require('../models/post')
var path = require('path')
const Question =require('../models/question')
/*
create an admin account
*/
exports.signup = (req, res, next) => {
    console.log('sign up initiated')
    bcryptjs.hash(req.body.password, 10)
        .then((hash) => {
            const admin = new Admin({
                email: req.body.email,
                password: hash
            })
            admin.save().then((result) => {
                res.status(200).json({
                    message: 'admin account created successfully',
                    admin: result
                })
            }).catch((err) => {
                console.log('err',err)
                res.status(500).json({
                    message: err
                })
            })
        })
}

/*
login an admin with token
*/
exports.login = (req, res, next) => {
    let fetchedAdmin;
    Admin.findOne({ 'email': req.body.email }).then((admin) => {
        if (!admin) {
            return res.status(401).json({
                message: 'auth failed'
            })
        }
        fetchedAdmin = admin
        return bcryptjs.compare(req.body.password, admin.password)

    }).then(result => {
        if (!result) {
            res.status(401).json({
                message: 'auth failed'
            })
        }

        // if password is valid
        const token = jwt.sign(
            { email: fetchedAdmin.email, adminId: fetchedAdmin._id },
            'admin_secret_key',
            { expiresIn: "1h" });
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userid: fetchedAdmin._id
        })

    })
        .catch(err => {
            return res.status(401).json({
                message: 'auth failed'
            })
        })
}



exports.getSensorData = (req, res, nex) => {
    const projectId = req.params.id;
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedData;
    let totalPost = 0
    const SensorDataQuery = SensorData.find({ 'projectId': projectId })
    if (pageSize && currentPage) {
        SensorDataQuery.skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    Post.find({ '_id': projectId }).then(resl => {
        if (resl[0].sensorList.length === 0) {
            res.status(201).json({
                message: 'no sensor data was asked in this project',
                sensorData: [],
                sensorDataCount: totalPost,
            })
        }
        else {
            SensorData.find({ 'projectId': projectId }).count().then((dt) => {
                totalPost = dt
                SensorDataQuery.sort([['userId', 1], ['sensorData', 1], ['createdAt', -1]]).populate('userId').populate('projectId').then((data) => {
                    if (!data || data.length == 0) {
                        return res.status(201).json({
                            message: 'no sensor data available yet',
                            sensorData: [],
                            sensorDataCount: totalPost,
                        }).end()
                    }
                    if (data[0].projectId.creator != req.userData.userId) {
                        return res.status(404).json({
                            message: 'not authorized'
                        }).end()
                    }
                    else {
                        fetchedData = data
                        res.status(200).json({
                            message: 'sensor data found',
                            sensorData: fetchedData,
                            sensorDataCount: totalPost,
                        })
                    }
                })
                    .catch(err => {
                        console.log('ppp', err)
                        res.status(500).json({
                            message: 'error fetching sensor data',
                            err: err
                        })
                    })
            }).catch((err) => {
                console.log('ll', err)
                res.status(500).json({
                    message: 'error fetching sensor data',
                    err: err
                })
            })
        }
    })
}

exports.downloadData=(req,res,next)=>{
    const projectId = req.params.id;
    const adminId=req.userData.userId
    const filename=req.body.filename;
    let filepath=path.join(__dirname+'/../uploadss')+'/'+req.body.filename;
    console.log('server',projectId,adminId)

    Post.find({ '_id': projectId }).then(resl => {
        if (resl[0].sensorList.length === 0) {
            res.status(201).json({
                message: 'no such project exist'
            })
        }
        else {
            SensorData.findOne({'filename':filename}).populate('projectId').then((results)=>{
                console.log('rs',results.projectId.creator,adminId)
                if (results.projectId.creator!= adminId){
                    console.log('not alwd')
                    return res.status(404).json({
                        message: 'not authorized'
                    }).end()
                }
                else{
                    //code to download the file
                    console.log('code here')
                    res.sendFile(filepath)
                }
            })

}
    }).catch(err=>{
        res.status(400).json({
            message: 'error fetching file'
        })
    })

}


exports.getQuestionAnswers = (req, res, nex) => {
    const projectId = req.params.id;
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedQuestions;
    let fetchedAnswers;
    console.log('all data recvd',projectId,req.userData.userId,pageSize,currentPage)
    let totalAnswers = 0
    const AnswerDataQuery = Answer.find({ 'projectId': projectId })
    if (pageSize && currentPage) {
        AnswerDataQuery.skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    Question.find({ 'projectId': projectId }).then(resl => {
        console.log('kk',resl)
        if (resl.length === 0) {
            res.status(201).json({
                message: 'no question was asked in this project',
                Answers: [],
                AnswersCount: totalAnswers,
            })
        }
        else {
            Question.find({ 'projectId': projectId }).count().then((dt) => {
                totalAnswers = dt
                console.log('dt',dt)
                AnswerDataQuery.sort({'userId': 1}).populate('userId').populate('projectId').populate('questionId').then((data) => {
                    console.log('data',data)
                    if (!data || data.length == 0) {
                        return res.status(201).json({
                            message: 'no answer data available yet',
                            Answers: [],
                            AnswersCount: totalAnswers,
                        }).end()
                    }
                    if (data[0].projectId.creator != req.userData.userId) {
                        return res.status(200).json({
                            message: 'not authorized',
                            Answers: [],
                            AnswersCount: 0
                        }).end()
                    }
                    else {
                        fetchedAnswers = data
                        res.status(200).json({
                            message: 'sensor data found',
                            Answers: fetchedAnswers,
                            AnswersCount: totalAnswers,
                        })
                    }
                })
                    .catch(err => {
                        console.log('ppp', err)
                        res.status(500).json({
                            message: 'error fetching answers data',
                            err: err
                        })
                    })
            }).catch((err) => {
                console.log('ll', err)
                res.status(500).json({
                    message: 'error fetching answers data',
                    err: err
                })
            })
        }
    })
}


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