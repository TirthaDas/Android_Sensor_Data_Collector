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
  duration:String

});

module.exports=mongoose.model('Post',postSchema);
