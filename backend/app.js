const express = require('express');
const bodyParser=require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETA,OPTIONS");

  next();
});
app.post("/api/posts",(req,res,next)=>{
  const post=req.body;
  console.log(post);
  res.status(201).json({
    message:'post added sccessfuly'
  });

});
app.get('/api/posts',(req, res, next) => {
    const posts=[
      {id:'aksjndlsakn',title:'this is the first post',content:'this is coming from server'},
      {id:'aosnfaios',title:'this is the second post',content:'this is also from server but for the second post'}];
    res.status(200).json({
      message:'posts fetched succesfully',
      posts:posts
    });
  });
module.exports = app;
