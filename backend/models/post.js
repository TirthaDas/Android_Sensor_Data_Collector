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
  // gyroscope:{
  //   type:Boolean,
  //   default:false
  // },
  // accelerometer:{
  //   type:Boolean,
  //   default:false
  // },
  // orientation:{
  //   type:Boolean,
  //   default:false
  // },
  // proximity:{
  //   type:Boolean,
  //   default:false
  // },
  // light:{
  //   type:Boolean,
  //   default:false
  // },
  // magneticField:{
  //   type:Boolean,
  //   default:false
  // },
  sensorList:[String],
  activeUsers:[Schema.Types.ObjectId]

});

module.exports=mongoose.model('Post',postSchema);
