const User = require('../models/Users')

const putUserByID = async(req, res)=>{
    try{
      const _user_name = req.params.user_name
      const user = await User.findOne({_user_name})
      const {active} = req.body
      if (!user){
        await user.create({
          user_name,
          email, 
          first_name, 
          last_name,
          phone,
          active: true,
          role, 
          date_registered: Date.now()
        })
        return res.status(201).json(user)
      }
      else {
        user.active = active
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
    putUserByID
  }