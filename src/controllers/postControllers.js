const User = require('../models/Users');
const Profile = require('../models/Profile');
const Business = require('../models/Business')
const Projects = require('../models/Projects');
const Milestones = require('../models/Milestones');
const jwt = require ('jsonwebtoken')
const cryptoRandomString = require ('crypto-random-string');
const {hash, compare } = require('../utilities/bcrypt');
const emailService = require('../utilities/emailService');
const Code = require('../models/verificationCode')
const SME = require('../models/SME');
const verifyDocs = require('../models/SMEVerifyImages')

const {JWT_SEC, EMAIL_USER} = require ('../utilities/secrets');




const postNewUser =async (req, res, next) => {
    try {
        const {
          username, 
          email,
          password,
        } = req.body
  
        const user = await User.create({
          username, 
          email,
          password,
          profile : await Profile.create({
            phone:"", 
            firstName:"",
            lastName:"",
            identificationNumber:"",
            address:"",
            emergencyContact:"",
            DOB:"",
            position:"",
          })
        })
        return res.status(201).json(user)
        
    } catch (error) {
        return res.status(500).json({error:error})
    }
    
  }

  const createBusiness = async function(userID, business) {
    const docBusiness = await Business.create(business);
    return User.findByIdAndUpdate(
      userID, 
      { $push: { business: docBusiness._id } },
      { new: true, useFindAndModify: false }
    );
  };

  const postBusiness = async (req, res, next) =>{
    const {
            businessName, 
            location, 
            numberOfEmployees, 
            registrationID, 
            registrationDate,
             businessType,  
             businessDescription, 
             category,  
             annualIncome,
             userID
          } = req.body

          const coy = {
            businessName, 
            location, 
            numberOfEmployees, 
            registrationID, 
            registrationDate,
             businessType,  
             businessDescription, 
             category,  
             annualIncome,
             userID
          };
    try{
      createBusiness(userID, coy)
      return res.status(201).json({
        coy
      })

    }catch(err){
      res.status(500).json({err})
    }
  }
   


  // const postBusiness = async (req, res, next) =>{
  //   try {
  //     const {
  //       businessName, 
  //       location, 
  //       numberOfEmployees, 
  //       registrationID, 
  //       regstrationDate,
  //        businessType,  
  //        businessDescription, 
  //        category,  
  //        annualIncome,
  //        userID
  //     } = req.body

        
  //      const company = await User.findByIdAndUpdate(userID,
  //         {
  //           $push: { 
  //             business: {
  //               businessName,
  //               location,
  //               numberOfEmployees,
  //               registrationID,
  //               regstrationDate,
  //               businessType,
  //               businessDescription,
  //               category,
  //               annualIncome
  //             }
  //           }
  //         },
  //         { new: true, useFindAndModify: false }
  //       );
  //         console.log(company)

  //     return res.status(201).json(company)
      
  // } catch (error) {
  //     return res.status(500).json({error:error})
  // }
  // }

  const createProject = async function(businessID, project) {
    const docProject = await Projects.create(project);
    return Business.findByIdAndUpdate(
      businessID, 
      { $push: { projects: docProject._id } },
      { new: true, useFindAndModify: false },
    );
  };
  const postProject = async (req, res, next) =>{
    const errors = []
    const {
      projectName, 
      projectDescription,
      projectDuration,
      amountNeeded,
      milesStones,
      companyID} = req.body
      try {
          const project = {
          projectName, 
          projectDescription,
          projectDuration,
          amountNeeded,
          milesStones,
          companyID
          }
         
          await createProject(companyID, project)
          return res.status(201).json({
            project
          })
        
      } catch (error) {
        errors.push({message: "an error occured"+error})
          res.status(500).json({
            errors
          })
      }
    
    
  }
  const createMileStone = async function(projectID, milestone) {
    const docMilestone = await Milestones.create(milestone);
    return Projects.findByIdAndUpdate(
      projectID, 
      { $push: { milesStones: docMilestone._id } },
      { new: true, useFindAndModify: false },
    );
  };
  const postMilestone = async (req, res, next) =>{
    
    const {
      name,
      description,
      amount,
      duration,
      startdate,
      endDate,
      status,
      projectID
    } = req.body
    try {

      const milestone = {name,
        description,
        amount,
        duration,
        startdate,
        endDate,
        status,
        projectID
      }
      
      await createMileStone(projectID, milestone)
      return res.status(201).json({
        milestone
      })

    } catch (error) {
      res.status(500).json({message: error})
    }
  }
  
  const registerSME = async (req, res, next) =>{
    let errMsg =[]
    const {username, password, confirmPassword, email} =req.body

    try {
      if(!username || !password || !confirmPassword || !email){
        errMsg.push({message: "All fileds are required"});
      }
      if(password != confirmPassword){
        errMsg.push({message: "Password does not match"});
      }
    //   if (!password.match(
    //         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/) ){
    //     errors.push({
    //         msg:
    //             "Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.",
    //     });
    // }
      if(errMsg > 0){
        res.statu(500).json({
          errMsg
        })
      }else{
          const userExists = await SME.findOne({email: email})
          if(userExists) {
            errMsg.push({message: "Email already exists"})
            res.send({success: false, errMsg})
          }else{
            const hashPwd = await hash(password)
            const newSME = new SME({
              username, 
              password: hashPwd, 
              confirmPassword, 
              email
            })
            const sme = await newSME.save()
            const payload = {
              id: sme._id,
              email: sme.email,
              username: sme.username,
            }
          // 
           const signOptions = {
             expiresIn:  "1h"
           };
           const token = jwt.sign(payload, JWT_SEC, signOptions );
          //req.session.token = token;
           
          // console.log(token)

            const baseUrl = req.protocol + "://" + req.get("host");
            const secretCode = cryptoRandomString({length: 15});
            
            const newCode = new Code({
              code: secretCode,
              email: sme.email,
            });
  
            await newCode.save();
            //console.log(newCode)
            
            const emailData = {
              from : `Inesta <${EMAIL_USER}>`,
              to: sme.email,
              subject: 'Investa Activation Link',
              text: `Dear ${sme.username} Please use the following link within the next 10 minutes to activate your account on Investa: ${baseUrl}/api/v1/auth/verify-account/${sme._id}/${secretCode}`,
              html: `<p>Please use the following link within the next 10 minutes to activate your account on Investa: <strong><a href="${baseUrl}/api/v1/auth/verify-account/${sme._id}/${secretCode}" target="_blank">Email</a></strong></p>`,
            }
            let sentMail = await emailService.sendMail(emailData)

            // console.log("Message sent: %s", sentMail);
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(sentMail));
        
            res.json({
              success: true,
              userRole: sme.role,
              userId: sme._id,
              userStatus: sme.status,
          });
        }
      }
       
    } catch (err) {
      console.log("Error on /api/auth/register: ", err);
      errMsg.push({
          msg: "Oh, something went wrong. Please try again!",
      });
      res.json({ success: false, errMsg });
  }

  }

  const expiredActivationLink = async (req, res, next)=>{
    const baseUrl = req.protocol + "://" + req.get("host");
    const {email, userId} = req.body
    try {
      const isRegistered = await SME.findOne({email})
      if(!email){
        res.json({
          message: "Email Field is required"
        })
      }else{
          if(!isRegistered){
            res.send({
              message: "Not a regisetered email"
            })
          }else{
            if(isRegistered && isRegistered.status == "active"){
              res.json({
                message: "You already activated please login"
              })
            }else{
                 await Code.deleteMany({email: isRegistered.email})
                const secreteCode = cryptoRandomString({
                  length: 10,
                })
                const newCode = new Code({
                  email: isRegistered.email,
                  code: secreteCode
                })

               await newCode.save()
               
                const emailData = {
                  from : `Inesta <${EMAIL_USER}>`,
                  to: isRegistered.email,
                  subject: 'Investa Activation Link',
                  text: `Dear ${isRegistered.username} Please use the following link within the next 10 minutes to activate your account on Investa: ${baseUrl}/api/v1/auth/verify-account/${isRegistered._id}/${secreteCode}`,
                  html: `<p>Please use the following link within the next 10 minutes to activate your account on Investa: <strong><a href="${baseUrl}/api/v1/auth/verify-account/${isRegistered._id}/${secreteCode}" target="_blank"><button style="background: lightblue; pading: 10px, border: none; outline: none; cursor: pointer; color: white;">Verify</button></a></strong></p>`,
                }
              
                let sentMail = await emailService.sendMail(emailData)
                  
                console.log("Message sent: %s", sentMail);

                res.json({
                  newCode
                })
              }
            }
            
        }
      
    } catch (error) {
      res.json({error})
    }
  }


  const signIn = async (req, res, next)=>{
    const {email, password} = req.body
    let errMsg = [];

    if(!email || !password){
      errMsg.push({message: "Password and Email Fileds are required"})
    }else{
      try {
        const user = await SME.findOne({email})
          if(!user){
            res.status(404).json({
              message: " Invalid user or password Combination"
            })
          }else{
            const pwdCheck = await compare(password, user.password)
            if(!pwdCheck){
                errMsg.push({
                  message: "Invalid password and Email compination"
                })
                res.json({ success: false, errMsg });              
            }else{
              const payload = {
                id: user._id,
                email: user.email,
                username: user.username,
              }
            // 
             const signOptions = {
               expiresIn:  "1h"
             };

             const token = jwt.sign(payload, JWT_SEC, signOptions );
              req.header.token = token;
              //console.log(token, user)
              const result = {
                userId: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                status: user.status,
                token
              }
              res.status(200).json({
                result
              })
            }
            
          }
        
      } catch (error) {
        res.status(500).json({
          message: "An internal Server Error Occured"
        })
      }
    }

  }

  const getPasswordResetCode = async (req, res, next) =>{
    const baseUrl = req.protocol + "://" + req.get("host");
    const errorMSg = [];
    const {email} = req.body;

    try {
      if(!email){
        errorMSg.push("Email field is required")
      }
      const isRegistered = await SME.findOne({email})

      if(!isRegistered){
        errorMSg.push({
          message: "No such User"
        })
        res.status(404).json({
          errorMSg
        })
      }else{
        const secreteCode = cryptoRandomString({
          length: 10,
        })
        const newCode = new Code({
          email: isRegistered.email,
          code: secreteCode
        })

       await newCode.save()
       
        
       
        const emailData = {
          from : `Investa <${EMAIL_USER}>`,
          to: isRegistered.email,
          subject: 'Investa Password Reset Link',
          text: `Dear ${isRegistered.username}, Please use  this activation code ${secreteCode}  or click on the link within the next 10 minutes to reset your Investa Password: ${baseUrl}/api/v1/auth/reset-password/`,
          html: `<p>Dear ${isRegistered.username}, Please use this activation code ${secreteCode} or click on link within the next 10 minutes reset your Investa password: <strong><a href="${baseUrl}/api/v1/auth/reset-password/" target="_blank"><button style="background: lightblue; pading: 10px, border: none; outline: none; cursor: pointer; color: white;">Verify</button></a></strong></p>`,
        }
        
        console.log(emailData)
        let sentMail = await emailService.sendMail(emailData)

        res.status(200).json({
          message: "Password Reset Link Sent", sentMail

        })

      }
      
    } catch (error) {
      errorMSg.push(error)
      res.send(errorMSg)
    }

  } 

  const verifyPasswordResetcode = async (req, res, next) =>{
    const {email, password, confirmPassword, code} = req.body
    const errMsg = []
    if(!email || !password || !confirmPassword || !code ){
      errMsg.push("All fileds are required")
    }
    if(password != confirmPassword){
      errMsg.push("Password does not match")
    }
    
    if(errMsg.length > 0){
      res.status(500).json({
        success: false, errMsg
      })
    }else{
      try {
        const hasCode = await Code.findOne({code, email})
        if(!hasCode){
          res.status(404).json({
            message: "The code you entered is not correct"
          })
        }else{
              const newHashedPw = await hash(password);
                await SME.updateOne({ email }, { password: newHashedPw });
                await Code.deleteOne({ email, code });
                res.json({ success: true, message: "Password Successfully Changed, You can login" });
        }
        
      } catch (error) {
        res.status(500).json({
          message: "Oops, unknown error occured"
        })
      }
    }
  }


  const verifySMEDocs = async (req, res, next) =>{

    try{

      if(req.files.por == undefined || req.files.finDoc == undefined || req.files.certificate == undefined || req.body.business == ''){      
        res.send({
          message: "All fileds are required"
        })
        return
      }else{

      const certificate = req.files.certificate[0].path;
      const  por = req.files.por[0].path;
      const finDoc = req.files.finDoc[0].path;
      const business = req.body.business

      const sendDoc = await new verifyDocs({
        certificate, por, finDoc, business
      })
      const biz= await Business.findByIdAndUpdate(business, 
        { $push: { verifyDocs: sendDoc._id } },
        { new: true, useFindAndModify: false },
      );
      
      await sendDoc.save()

        res.send({
          sendDoc, biz
        })
    } 
  }catch (error )
      { console.log(error)}
  }
  



module.exports ={
    postNewUser,
    postBusiness,
    postProject,
    postMilestone,
    registerSME,
    signIn,
    expiredActivationLink,
    getPasswordResetCode,
    verifyPasswordResetcode,
    verifySMEDocs
}