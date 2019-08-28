const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  Fullname: {
    type:String,
    trim:true,
    default:true
  },
  Username:{
    type:String,
    trim:true,
    default:true
  },
  Email: {
    type:String,
    trim:true,
    default:true
  },
  Password:{
    type:String,
    trim:true,
    default:true
  }
  // Gender: {
  //   type:String,
  //   trim:true,
  //   default:true
  // }
  
});

module.exports=mongoose.model('User',userSchema);
