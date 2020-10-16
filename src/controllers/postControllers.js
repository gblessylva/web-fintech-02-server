const User = require('../models/Users');

const postNewUser =async (req, res, next) => {
    try {
        const {
          user_name, 
          email, 
          first_name, 
          last_name,  
          phone} = req.body
  
        const user = await User.create({
          user_name, 
          email, 
          first_name, 
          last_name, 
          date_registered : Date.now(), 
          phone,
          status: "active",
          role: "user"
        })
        return res.status(201).json(user)
        
    } catch (error) {
        return res.status(500).json({"error":error})
    }
    
  }


module.exports ={
    postNewUser
}