const mongoose = require('mongoose')

const SMEVerifyDocs =mongoose.Schema({
    //Certificate of incoporation
    certificate:{
        type: String,
        required: true
    },
    //Proof of Residence
    por: {
        type: String,
        required: true,
    },
    //Financial Documents like returns, balance sheet, bank statement
    finDoc: {
        type: String,
        required: true,
    },
    business: {
        type:mongoose.Schema.Types.ObjectId, 
        ref : 'business',
        required: true
    }

})

module.exports = mongoose.model('SMEVerifyDocs', SMEVerifyDocs)