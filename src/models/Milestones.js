const mongoose = require('mongoose');

const MilsestoneSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        required: true,
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    duration: {
        type: String
    },
    startdate: {
        type: String
    },
    endDate: {
        type: String
    },
    status: {
        type: String,
        default: "To Do"
    },
    projectID: {
        type:mongoose.Schema.Types.ObjectId, 
        ref : 'Projects',
        required: true
    },
})
module.exports = mongoose.model("Milestones", MilsestoneSchema)