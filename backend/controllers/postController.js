const Post = require('../models/post');
const Question= require('../models/question')

//methods

exports.createPost=(req,res,next)=>{
  questionArray=[]
  if (req.body.FirstQuestion){
    questionArray.push(req.body.FirstQuestion)
  }
  if (req.body.SecondQuestion){
    questionArray.push(req.body.SecondQuestion)
  }
  if (req.body.ThirdQuestion){
    questionArray.push(req.body.ThirdQuestion)
  }
  if (req.body.FourthQuestion){
    questionArray.push(req.body.FourthQuestion)
  }
  if (req.body.FifthQuestion){
    questionArray.push(req.body.FifthQuestion)
  }

  console.log('POST ARRIVED', req.body)
  console.log('questions ARRIVED', questionArray)

    const post=new Post({
      title:req.body.title,
      content:req.body.content,
      activeUser:[],
      fileType:req.body.fileType,
      sensorList:req.body.sensorType
    });
    
    console.log('new post added',post);
    post.save().then((createdPost) => {

      // add questions
      var ctr = 0;
      if(questionArray.length>0){
      for(i=0;i<questionArray.length;i++){
        const question= new Question({
          question:questionArray[i],
          projectId:createdPost._id
        })
        question.save().then(()=>{
          ctr++;
          console.log('fffff',ctr,questionArray.length)

          if (ctr==questionArray.length){
            console.log('vvvv',ctr,questionArray.length)
              res.status(201).json({
              message:'post added sccessfuly',
              postId:createdPost._id
              })
          }
        }).catch(()=>{

        })
      }

    }
    else{
res.status(201).json({
        message:'post added sccessfuly',
        postId:createdPost._id
      });
    }
      
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
        Question.find({projectId:req.params.id}).then((questions)=>{
          if(!questions || questions.length==0){
            res.status(200).json(post)

          }
          else{
            res.status(200).json({
              posts:post,
              questions:questions
            })
          }

        })
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

      Question.deleteMany({projectId:req.params.id}).then(()=>{
        res.status(200).json({message:'post and questions succesfully deleted'});

      })
      .catch(()=>{
        res.status(400).json({
          message:'error deleting post'
        })
      })

    }).catch((err) => {
      console.log(err)
      res.status(400).json({
        message:'error deleting post'
      })
    })
  }