const mongoose = require('mongoose');
const uniqueValidator=require('mongoose-unique-validator')
const adminSchema = mongoose.Schema({
  email: {
    type:String,
    trim:true,
    required:true,
    unique:true
  },
  password:{
    type:String,
    trim:true,
    required:true
  }
  
});
adminSchema.plugin(uniqueValidator)
module.exports=mongoose.model('Admin',adminSchema);
