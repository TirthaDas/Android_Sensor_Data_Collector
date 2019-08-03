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
  userId: {type:mongoose.Schema.Types.ObjectId, ref:'User' } ,


});

module.exports=mongoose.model('SensorData',sensorDataSchema);
