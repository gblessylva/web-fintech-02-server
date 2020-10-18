const mongoose = require('mongoose');

const BusinessSchema   = mongoose.Schema({
    businessName : {
        type: String,
        required: true,
    },
    location:  String,
    numberOfEmployees: String,
    registrationID: {
        type: String, 
        required :true
    },
    regstrationDate: String,
    businessType: {
        type:String, 
        required: true
    },
    category: {
        type: String,
        required: true
    },
    businessDescription: {
        type: String
    },
    annualIncome: {
        type: Number,
        required: true,
        default: 0
    },
    userID: {
        type:mongoose.Schema.Types.ObjectId, 
        ref : 'User',
        required: true
    },

})
module.exports = mongoose.model('business', BusinessSchema)