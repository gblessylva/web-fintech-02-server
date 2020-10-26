const Business = require('../models/Business')
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

  const patchBusinessById = async (req, res, next)=>{
    const id = req.params.id
    const {businessName, 
      location, 
      numberOfEmployees, 
      registrationID, 
       registrationDate,
       businessType,  
       businessDescription, 
       category,  
       annualIncome,
       userID} = req.body
    try{
      //const UID = req.params.UID
      const business = await Business.findByIdAndUpdate(id)
      // res.send(business)
      if(!business){
        res.status(404).json({
          message: "No such user Exit"
        })
      }else{
        business.businessName = businessName , 
        business.location = location, 
        business.numberOfEmployees = numberOfEmployees, 
        business.registrationID = registrationDate, 
        business.businessType = businessType,  
        business.businessDescription = businessDescription, 
        business.category = category,  
        business.registrationID = registrationID
        business.annualIncome = annualIncome
        
        await business.save()
 
        res.status(200).json({business})
  
      }  
    }catch(err){
      res.status(500).json({
        message: "A Server error occured, check that the id is complete"
      })
    }
    

  }
  module.exports ={
    patchUserByID,
    patchBusinessById
  }