const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' }, // e.g., 'customer', 'agent', 'manager'
  gender: {type:String,required:true},
  dob: {type:String,required:true},
  country:{type:String,required:true}
});

module.exports = mongoose.model('User', UserSchema);
