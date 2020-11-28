const User = require('../models/Users')
const Profile = require('../models/Profile')
const Business = require('../models/Business')
const APIFeatures = require ('../utilities/APIFeatures')
const SME = require('../models/SME')
const Code = require('../models/verificationCode')
const Projects = require('../models/Projects')
const Milestones= require('../models/Milestones')
const homeRoute = async (req, res) => {
    try {
        return res.status(200).send('Home Route')
    } catch (error) {
        return res.status(500).json({"error":error})
    }
  }

  const getUsersRoute = async (req, res) => {
    try {
      const users = await User.find()
      .populate("profile business")
      return res.status(200).json(users)
        
    } catch (error) {
        return res.status(500).json({"error":error})
    }
  }

  const getBusiness = async(req, res, next) =>{
    try{
      const business = await Business.find()
      // .populate("userID")
      // .populate({ path: 'verifyDocs', select: 'certificate por finDoc'})
      const project = await Projects.find({companyID: business[0]._id})
      res.status(200).json({
        project,
        business
      })

    }catch(error) {
      res.status(500).json({
        error: error
      })
    }
  }
  const getUserByID = async (req, res) => {
    const _id =req.params.id
    try {
        
        const user = await User.findById({_id})
        .populate("profile business")
        
        if(!user){
          return res.status(404).json("No such User Found")
        } else {
         
            return res.status(200).json({
              user
            })

          }
                
    } catch (error) {
        return res.status(500).json({error:error})
    }
    
  }

  const getProjects = async (req, res, next) =>{
    try{
      const project = await Projects.find()
      .populate('milestones')
      .then(results=>{
        res.status(201).json(results)
      })
      
    }catch(error){
      return res.status(500).json({
        message: error
      })
    }
  }
  const getMilestones = async(req, res, next)=>{
    
    try {
      Milestones.find()
      .select('status name description amount duration startdate endDate projectID')
      .then(result=>{
        res.status(200).json(result)
      })
      
    } catch (error) {
      console.log(error)
    }

    
  }
  const getProfile = async (req, res, next) =>{
    const features = new APIFeatures(Profile.find(), req.query )
    .filtering()
    .sorting()
    try{
      const profile = await features.query
      .populate('userID')
      .then(results=>{
        const count = results.length  
          res.status(200).json({
          count,
          allUsers: results
        })
         
        
      })
    }catch(err){
      return res.status(500).json({
        message: err
      })
    }
  }

  const verifyPendingUser = async (req, res, next) =>{
    const baseUrl = req.protocol + "://" + req.get("host");
    const errorMsg = []
   const _id = req.params.userId
    try {
      const user = await SME.findById({_id})
      const response = await Code.findOne({
        email: user.email,
        code: req.params.secretCode,
      });

      if(!user){
        res.sendStatus(401);
      }else{
        await SME.updateOne({
          email: user.email,
          status: "active"
        })
        await Code.deleteMany({email: user.email})

        const redirectPath = `${baseUrl}/api/v1/account-verified`
        
        await res.redirect(redirectPath);
      }
      
    } catch (error) {
      res.send(error)
    }
  }

  const verifiedAccount = (req, res, next) =>{
    res.json({
      message: "You have been verified successfully, please login"
    })
  }

module.exports ={
    homeRoute,
    getUsersRoute,
    getUserByID,
    getProjects,
    getProfile,
    getBusiness,
    verifyPendingUser,
    verifiedAccount,
    getMilestones
}