const User = require('../models/Users')

const homeRoute = async (req, res) => {
    try {
        return res.status(200).send('Home Route')
    } catch (error) {
        return res.status(500).json({"error":error})
    }
  }

  const getUsersRoute = async (req, res) => {
    try {
      const user = await User.find()
        return res.status(200).json(user)
        
    } catch (error) {
        return res.status(500).json({"error":error})
    }
    
  }

  const getUserByID = async (req, res) => {
    try {
        const _id =req.params.id
        const user = await User.findById({_id})
        if(!user){
          return res.status(404).json("No such User Found")
        } else {
          return res.status(200).send(user)
        }        
    } catch (error) {
        return res.status(500).json({"error":error})
    }
    
  }


module.exports ={
    homeRoute,
    getUsersRoute,
    getUserByID
}