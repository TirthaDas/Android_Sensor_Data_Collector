const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type:String,
    trim:true,
    default:true
  },
  content:{
    type:String,
    trim:true,
    default:true
  }
});

module.exports=mongoose.model('Post',postSchema);
