
// import all required packages
const express = require('express');
const bodyParser=require('body-parser');
const Post = require('./models/post');
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
