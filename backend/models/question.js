const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  question: {
    type:String,
    trim:true,
    require:true
  },
  projectId:{type:mongoose.Schema.Types.ObjectId,ref:'Post'}

});

module.exports=mongoose.model('Question',questionSchema);
