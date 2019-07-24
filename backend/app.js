
// import all required packages
const express = require('express');
const bodyParser=require('body-parser');
const Post = require('./models/post');
const User = require('./models/user');

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
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS");

  next();
});

/*
  CREATE A POST
*/

app.post("/api/posts",(req,res,next)=>{
  const post=new Post({
    title:req.body.title,
    content:req.body.content
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
module.exports = app;
