
// import all required packages
const express = require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');


// get the routes
const UserRoutes=require('./routes/users')
const PostRoutes=require('./routes/posts')
const AdminRoutes=require('./routes/admins')


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

// CORS-ORIGIN configuration
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,PUT,DELETE,OPTIONS");

  next();
});



app.use([UserRoutes,PostRoutes,AdminRoutes])

module.exports = app;
