const mongoose = require('mongoose');

const sensorDataSchema = mongoose.Schema({
  name: {
    type:String,
    trim:true,
    require:true
  },
  sensorData: {
    type:String,
    trim:true,
    require:true
  },
  filename:{
    type:String,
    trim:true
  },
  userId: {type:mongoose.Schema.Types.ObjectId, ref:'User' } ,
  projectId:{type:mongoose.Schema.Types.ObjectId,ref:'Post'}

},{
  timestamps: true
});

module.exports=mongoose.model('SensorData',sensorDataSchema);
