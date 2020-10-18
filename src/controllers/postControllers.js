const User = require('../models/Users');
const Profile = require('../models/Profile');
const Business = require('../models/Business')

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

  const postBusiness = async (req, res, next) =>{
    try {
      const {
        businessName, 
        location, 
        numberOfEmployees, 
        registrationID, 
        regstrationDate,
         businessType,  
         businessDescription, 
         category,  
         annualIncome,
         userID
      } = req.body

      const company = await Business.create({
        businessName, 
        location, 
        numberOfEmployees, 
        registrationID, 
        regstrationDate,
         businessType,  
         businessDescription, 
         category,  
         annualIncome,
         userID
      })
      return res.status(201).json(company)
      
  } catch (error) {
      return res.status(500).json({error:error})
  }
  }

module.exports ={
    postNewUser,
    postBusiness,
}