const Post = require('../models/post');

//methods

exports.createPost=(req,res,next)=>{
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
  }

/*
     UPDATE A POST 
*/
exports.updatePost=(req,res,next)=>{
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
  }

/*
  GET ALL POSTS
*/

exports.getAllPosts=(req, res, next) => {
    Post.find().then((posts) => {
      console.log('posts found in db',posts);
      res.status(200).json({
        message:'posts fetched succesfully',
        posts:posts
      });
    }).catch((err) => {
      console.log(err);
    });

  }

/*
   GET A POST BY ID
*/

exports.getPostById=(req,res,next)=>{
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
  }

/*
   DELETE A POST 
*/
exports.deletePost=(req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id}).then((result)=>{
      console.log(result)
      res.status(200).json({message:'post succesfully deleted'});

    }).catch((err) => {
      console.log(err)
    })
  }