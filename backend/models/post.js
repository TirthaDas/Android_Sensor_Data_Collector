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
  },
  sensorList:[String],
  activeUsers:[mongoose.Schema.Types.ObjectId],
  duration:String,
  creator:{type:mongoose.Schema.Types.ObjectId,ref:'Admin'}

});

module.exports=mongoose.model('Post',postSchema);
