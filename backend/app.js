
// import all required packages
const express = require('express');
const bodyParser=require('body-parser');
const Post = require('./models/post');
const Question = require('./models/question');
const Answer = require('./models/answer');

const ActiveProject = require('./models/activeProject');

const User = require('./models/user');
const SensorData = require('./models/sensorData');
const multer = require('multer')
var path = require('path');
const storage= multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,path.join(__dirname+'/uploadss'))
  },
  filename:function(req,file,cb){
    cb(null,file.originalname)
  }
})
const upload = multer({storage:storage})

const mongoose = require('mongoose');


// set up express app
const app = express();

// connect to db
mongoose.connect("mongodb://localhost:27017/AndroidProject").then(() => {
  console.log('connected to database');
}).catch((err) => {
  console.log('connection failed', err);
});

// set up all middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,PUT,DELETE,OPTIONS");

  next();
});

/*
  CREATE A POST
*/

app.post("/api/posts",(req,res,next)=>{
  const post=new Post({
    title:req.body.title,
    content:req.body.content,
    activeUser:[]
  });
  console.log('new post added',post);
  post.save().then((createdPost) => {
    res.status(201).json({
      message:'post added sccessfuly',
      postId:createdPost._id
    });
  });


});

/*
   UPDATE A POST 
*/
app.put('/api/posts/:id',(req,res,next)=>{
  console.log(req.params.id);
  const newPost=new Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content
  });
  Post.updateOne({"_id":req.params.id},newPost)
  .then((post)=>{
    console.log(post)
    res.status(200).json({
      message:'post updated successfully'
    })
  })
  .catch(err=>{
    console.log(err)
    res.status(400).json({message:'post update unsuccessfull'})
  })
});

/*
  CREATE A USER
*/
app.post("/api/addUser",(req,res,next)=>{
  console.log('new user adding....', req.body)
  User.find({Email:req.body.Email}).then(user=>{
    if(!user || user.length==0){
      const user=new User({
        Fullname:req.body.Fullname,
        Username:req.body.Username,
        Email:req.body.Email,
        Password:req.body.Password,
        Gender:req.body.Gender,
      });
      user.save().then((createdUser) => {
        res.status(200).json({
          message:'Welcome '+createdUser.Username+' !!!!!!',
          UserID:createdUser._id,
          UserName:createdUser.Username
        });
      }).catch(err=>{
        res.status(400).json({
          message:'error in creating user'
          
        });
      });
    }else{
      console.log('new user adding....', typeof(user))

      res.status(201).json({
      message:'user already exists'
      })
    }
  }).catch(()=>{
    res.status(400).json({
      message:'error in creating user'
  })
  

});
});

/*
  LOGIN A USER
*/
app.post("/api/LoginUser",(req,res,next)=>{
  console.log('signing in user ....', req.body)
  
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;
  User.findOne({Email:loginEmail}).then((user)=>{
    if(!user || user.length==0){
      res.status(201).json({
        message:'user not found',
        
      })
    }else{
      if(loginPassword===user.Password){
        res.status(200).json({
          message:'welcome '+user.Username+' !!!!',
          UserID:user._id,
          UserName:user.Username
        })
      }else{
        res.status(202).json({
          message:'incorret password !!!',
          
        })
      }
      
    }
    
  }).catch((err)=>{
    console.log('signing in user 8....', err)
    
       res.status(400).json({
      message:'login error !!!'
    })
  })
  
});


/*
  GET ALL POSTS
*/
app.get('/api/posts',(req, res, next) => {
    Post.find().then((posts) => {
      console.log('posts found in db',posts);
      res.status(200).json({
        message:'posts fetched succesfully',
        posts:posts
      });
    }).catch((err) => {
      console.log(err);
    });

  });
/*
   GET A POST BY ID
*/
app.get('/api/posts/:id',(req,res,next)=>{
  Post.findById(req.params.id).then((post)=>{
    if(post){
      res.status(200).json(post)
    }
    else{
      res.status(404).json({
        message:"post not found"
      })
    }
  })
})

/*
   DELETE A POST 
*/
app.delete('/api/posts/:id',(req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id}).then((result)=>{
      console.log(result)
      res.status(200).json({message:'post succesfully deleted'});

    }).catch((err) => {
      console.log(err)
    })
  });



  /*
  UPLOAD THE SENSOR DATA
  */

  app.post("/api/uploadSensorData",upload.single('SensorData'),(req,res,next)=>{
    // console.log('requesss',req)  
    const sensorData=new SensorData({
        name:req.body.name,
        sensorData:req.file.path,
        userId:req.body.userId,
        projectId:req.body.projectId
        
      });
      sensorData
      .save()
      .then((result)=>{
        console.log(result)
        res.status(200).json({message:'sensor data file succesfully addedd'});
  
      }).catch((err) => {
        console.log(err)
      })

  })


/*
  ADD A USER TO POSTS
*/

  app.post("/api/addUsersToPosts",(req,res,next)=>{
    const userId = req.body.userId;
    const projectId = req.body.projectId;
    console.log('addUsersToPosts',userId,projectId,typeof(userId))  

    Post.findOne({"_id":projectId}).then((post)=>{
      if(!post || post.length==0){
        res.status(201).json({
          message:'post not found',
          
        })
      }else{
        ActiveUsersList=post.activeUsers
        console.log('in',post.activeUsers,"out",userId)
        for (activeUser of ActiveUsersList){
          console.log("1",activeUser,typeof(activeUser))
          if(activeUser== userId){
            console.log("user already has this projects as its active project")
            return res.status(201).json({
              message:"user already has this project as its active project"
            })
          }
        }
        Post.updateOne({"_id":projectId},{$push:{activeUsers:userId}}).then((result)=>{
          return res.status(200).json({
            message:'user added this project as active project'
          })
        }).catch(err=>{
          console.log('error updating posts')
        })
        
      }
      
    }).catch((err)=>{
      console.log('signing in user 8....', err)
      
         res.status(400).json({
        message:'login error !!!'
      })
    })
    
      

  })
/*
  ADD A ACTIVE PROJECT
*/
  app.post("/api/addToActiveProjects",(req,res,next)=>{
    const userId = req.body.userId;
    const projectId = req.body.projectId;
    const sensorList= req.body.sensorList;
    console.log('add active project',userId,projectId,sensorList)  

    ActiveProject.findOne({$and:[{"userId":userId},{"projectId":projectId}]}).then((activeProject)=>{
      if(!activeProject || activeProject.length==0){
        console.log("no active project found for this project")
        Post.findOne({"_id":projectId}).then((post)=>{
          console.log("pst",post)
          const title=post.title;
          const content= post.content;
          Question.find({"projectId":projectId})
          .then((questions)=>{
            if(!questions || questions.length==0){
              const newActiveProject=new ActiveProject({
                title:title,
                content:content,
                sensorList:sensorList,
                userId:userId,
                projectId:projectId,
                isCurrentlyActive:true,
                hasQuestions:false
              })
              console.log('new post added',post);
              newActiveProject.save().then((createdActiveProject) => {
              res.status(200).json({
                message:'A New Active created sccessfuly',
                _id:createdActiveProject._id
              });
              }).catch((err)=>{
              console.log("3333",err);
              })
            }
            else{
              const newActiveProject=new ActiveProject({
                title:title,
                content:content,
                sensorList:sensorList,
                userId:userId,
                projectId:projectId,
                isCurrentlyActive:true,
                hasQuestions:true

              })
              console.log('new post added',post);
              newActiveProject.save().then((createdActiveProject) => {
              res.status(200).json({
                message:'A New Active created sccessfuly',
                _id:createdActiveProject._id
              });
              }).catch((err)=>{
              console.log("3333",err);
              })
            }
          }).catch((err)=>{
            res.status(401).json({
              message:"no such project exist"
            })
          })
        }).catch((err)=>{
          res.status(401).json({
            message:"no such project exist"
          })
        })
        
      }
      else{
        console.log("44444",activeProject.isCurrentlyActive)
        const activeProjectId=activeProject._id
        const isCurrentlyActive=activeProject.isCurrentlyActive
        ActiveProject.update({"_id":activeProjectId},{$set:{isCurrentlyActive:true}}).then((result)=>{
          res.status(201).json({
            message:'this active project is updated',
            
          })
        }).catch(err=>{
          console.log(err)
        })        
        
      }
      
    }).catch((err)=>{
          console.log("5555555",err)
         res.status(400).json({
        message:' error finding active projects !!!'
      })
    })
  })



/*
  UPDATE ACTIVE PROJECTS STATUS
*/
app.post("/api/updateActiveProjectsStatus",(req,res,next)=>{
  console.log("active project update call",req.body.activeProjectId)
  const ActiveProjectId = req.body.activeProjectId;
  ActiveProject.findOne({"_id":ActiveProjectId}).then((activeProject)=>{
    if(!activeProject || activeProject.length==0){
      res.status(400).json({
        message:'no active project found with this id'
      })
      
    }
    else{
      console.log("44444",activeProject.isCurrentlyActive)
      const activeProjectId=activeProject._id
      ActiveProject.update({"_id":ActiveProjectId},{$set:{isCurrentlyActive:false}}).then((result)=>{
        res.status(201).json({
          message:'this active project is updated',
          
        })
      }).catch((err)=>{
        console.log("err",err)
      })        
      
    }
    
  }).catch((err)=>{
        console.log("5555555",err)
       res.status(400).json({
      message:' error finding active projects !!!'
    })
  })
  
})


  /*
  GET ALL ACTIVE PROJECTS
*/
app.post('/api/getAllActiveProjects',(req, res, next) => {
  const userId = req.body.userId;
  console.log('active Projects searching in db',req.body);
  
  ActiveProject.find({"userId":userId}).then((activeProjects) => {
    console.log('active Projects found in db',activeProjects);
    res.status(200).json({
      message:'Active Projects fetched succesfully',
      activeProjects:activeProjects
    });
  }).catch((err) => {
    console.log(err);
  });

});


/*
  GET QUESTIONS
*/
app.post('/api/getQestions',(req, res, next) => {
  const projectId = req.body.projectId;
  const userId = req.body.userId;

  console.log('searching questions in db',req.body);
  Answer.find({$and:[{"userId":userId},{"projectId":projectId}]})
  .populate("questionId","question")
  .then((answers)=>{
    if(!answers || answers.length==0)
    {
      Question.find({"projectId":projectId}).then((questions) => {
        res.status(200).json({
          message:"questions found sucessfully",
          questions:questions
        })
      })
      .catch(()=>{
        res.status(400).json({
          message:"an error occured while fetching questions"
        })
      })
      
    }else{
      res.status(200).json({
        message:'answers found for this project',
        answers:answers
      })
    }
  }).catch((err)=>{
    console.log(err)
    res.status(400).json({
      message:"an error occured"
    })
  })
});


/*
  SAVE ANSWERS
*/
app.post('/api/saveAnswers',(req, res, next) => {
  const projectId = req.body.ProjectId;
  const userId = req.body.UserId;
  const answers = JSON.parse(req.body.Answers)

  console.log('saving answers  to  db',answers);

  for(x=0;x<answers.length;x++){
    const AnswerObj={
      questionId:answers[x].QuestionId,
      userId:answers[x].UserId,
      projectId:answers[x].ProjectId,
      answer:answers[x].Answer
    }
    Answer.findOneAndUpdate({$and:[{"questionId":answers[x].QuestionId},{"userId":answers[x].UserId}]},
    {$set:AnswerObj},{upsert:true,useFindAndModify: false})
    .then((result)=>{
      console.log('result',result)
      
      
    }).catch((err)=>{
      console.log("e",err)
      res.json({
        message:"error saving answers",
        err:err
      })
    })
  }res.status(200).json({message:"successfully saved answers"}).end;
  });

module.exports = app;
