const nodemailer = require('nodemailer')

const {EMAIL_HOST, EMAIL_PORT, EMAIL_USER, PASS} = require('./secrets');
// let secrets;
// if (process.env.NODE_ENV == "production") {
//     secrets = process.env;
// } else {
//     secrets = require("./secrets");
// }


const emailService =  nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER, // generated ethereal user
      pass: PASS, // generated ethereal password
    }
})


module.exports = emailService;