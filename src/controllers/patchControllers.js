const User = require('../models/Users')

const patchUserByID = async(req, res)=>{
    try{
      const _id = req.params.id
      const user = await User.findByIdAndUpdate({_id})
      const {user_name, email, first_name, last_name, role,   phone, status} = req.body
      if (!user){
        await user.create({
          user_name,
          email, 
          first_name, 
          last_name,
          phone,
          status,
          role
        })
        return res.status(201).json(user)
      }
      else {
        user.user_name = user_name
        user.email= email
        user.first_name = first_name
        user.last_name= last_name 
        user.phone = phone,
        user.role = role,
        user.status = status
        await user.save()
        console.log(user)
        return res.status(201).json(user)
      }
    }
    catch(error){
      return res.status(500).json({'error': error})
    }
  }
  module.exports ={
    patchUserByID
  }