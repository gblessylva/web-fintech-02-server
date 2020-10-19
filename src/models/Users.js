
const mongoose = require('mongoose')
const schema = mongoose.Schema


const UserSchema = new schema({
  username: {
    type:  String,
    required: [true, 'username is required'],
    minlength: [3, 'Must be greater than three characters'],
    maxlength: [100, 'Must not be greater than 100 Characters']
  },
  email: {
    type:  String,
    required: [true, 'email is required'],
    minlength: [3, 'Must be greater than three characters'],
    maxlength: [100, 'Must not be greater than 100 Characters']
  },
  password: {
    type:  String,
    required: [true, 'Your Password is required'],
    minlength: [3, 'Must be greater than three characters'],
    maxlength: [100, 'Must not be greater than 100 Characters']
  },
  role: {
    type: String, required: true, default: "user"
  },
   profile: {
     type:mongoose.Schema.Types.ObjectId, 
     ref : 'Profile',
     required: true
    },
    business: [{
      type:mongoose.Schema.Types.ObjectId, 
     ref : 'business',
    }],
   
  dateRegistered: { type: Date, default: Date.now }

  })

module.exports = mongoose.model('User', UserSchema)