const mongoose = require('mongoose')
const SMESchema = mongoose.Schema({
    username: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword :{ 
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "sme",
    },
    status: {
        type: String,
        default: "pending",
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model("SME", SMESchema)