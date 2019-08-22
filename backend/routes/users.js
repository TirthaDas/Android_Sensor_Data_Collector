const express= require("express");
const routes = express.Router();
const multer = require('multer')
var path = require('path');
const userController = require('../controllers/userController')
// make storage config for multer
const storage= multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,path.join(__dirname+'/uploadss'))
    },
    filename:function(req,file,cb){
      cb(null,file.originalname)
    }
  })
const upload = multer({storage:storage})

// routes
routes.post("/api/addUser",userController.createUser);
routes.post("/api/LoginUser",userController.loginUser);
routes.post("/api/addUsersToPosts",userController.addUserToPost)
routes.post("/api/addToActiveProjects",userController.addToActiveProject)
routes.post("/api/updateActiveProjectsStatus",userController.updateActiveProjectStatus)
routes.post('/api/getAllActiveProjects',userController.getAllActiveProjects);
routes.post('/api/getQestions',userController.getQuestions);
routes.post('/api/saveAnswers',userController.saveAnswer);
routes.post("/api/uploadSensorData",upload.single('SensorData'),userController.uploadSensorData)
  
module.exports=routes;
