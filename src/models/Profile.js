const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    // Creates model relations
    phone: {
        type: String,
    },
    firstName: String,
    lastName: String,
    identificationNumber : String,
    address: String,
    emgergencyContact: String,
    DOB: String,
    position: {type: String}

})

module.exports = mongoose.model("Profile", profileSchema)