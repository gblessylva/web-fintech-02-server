const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    projectName : {
        type: String,
        required: true,
    },
    projectDescription: {
        type: String
    },
    projectDuration: {
        type: String
    },
    amountNeeded: {
        type: Number,
        required: true,
        default: 0
    },
    status:{
        type: String,
        required: true,
        default: "pending"
    },
    milestones:[
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref : 'Milestones',
        }
    ],
    companyID: {
        type:mongoose.Schema.Types.ObjectId, 
        ref : 'business',
        required: true
    },

})

module.exports = mongoose.model('Project', ProjectSchema)