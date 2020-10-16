const User = require('../models/Users')

const deleteOneUser = async (req, res)=>{
    try{
      const _id = req.params.id
      const user = await User.findByIdAndDelete(req.params.id)
  
      if(user.deletedCount === 0){
        return res.status(404).send('no such user found')
      }
      else{
        return res.status(204).send(user)
      }
    }
    catch(error){
      return res.status(500).send("there was an error", error)
    }
  }

  module.exports = {
      deleteOneUser
  }
  