const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
  answer: {
    type:String,
    trim:true,
    require:true
  },
  questionId: {type:mongoose.Schema.Types.ObjectId, ref:'Question'},
  userId: {type:mongoose.Schema.Types.ObjectId, ref:'User' },
  projectId:{type:mongoose.Schema.Types.ObjectId,ref:'Post'}

});

module.exports=mongoose.model('Answer',answerSchema);
