const User = require('../models/Users')
const Profile = require('../models/Profile')
const Business = require('../models/Business')
const { where } = require('../models/Users')
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
      return res.status(200).json({
        users
      })
        
    } catch (error) {
        return res.status(500).json({"error":error})
    }
  }

  const getBusiness = async(req, res, next) =>{
    try{
      const business = await Business.find()
      .populate("userID")
      res.status(200).json({
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
      const profile = await profile.find()
      .then(results=>{
        res.status(201).json({
          results
        })
      })
      
    }catch(error){
      return res.status(500).json({
        message: error
      })
    }
  }
  const getProfile = async (req, res, next) =>{
    try{
      const profile = await Profile.find()
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

module.exports ={
    homeRoute,
    getUsersRoute,
    getUserByID,
    getProjects,
    getProfile,
    getBusiness
}