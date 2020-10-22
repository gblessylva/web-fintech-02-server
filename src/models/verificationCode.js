const mongoose = require('mongoose');

const verificationCode = mongoose.Schema({
    
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
})  

module.exports = mongoose.model("Code", verificationCode)