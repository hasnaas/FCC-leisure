var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema =Schema({
   name:{type:String, required:true, min:3,max:100},
   twitterId:{type:String,required:true},
   reservationDate:{type:Number},
   goingTo:[String]
});

module.exports=mongoose.model('User',UserSchema);