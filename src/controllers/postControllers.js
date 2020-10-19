const User = require('../models/Users');
const Profile = require('../models/Profile');
const Business = require('../models/Business')
const Projects = require('../models/Projects');
const Milestones = require('../models/Milestones');

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
    




module.exports ={
    postNewUser,
    postBusiness,
    postProject,
    postMilestone
}