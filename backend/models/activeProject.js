const mongoose = require('mongoose');

const activeProjectSchema = mongoose.Schema({
  title: {
    type:String,
    trim:true,
    require:true
  },
  content:{
    type:String,
    trim:true,
    default:true
  },
  sensorList:{
    type:String,
    trim:true,
    default:true
  },
  hasQuestions:{type:Boolean},
  userId: {type:mongoose.Schema.Types.ObjectId, ref:'User' } ,
  projectId:{type:mongoose.Schema.Types.ObjectId,ref:'Post'},
  isCurrentlyActive:{
      type:Boolean
  }

});

module.exports=mongoose.model('ActiveProject',activeProjectSchema);
