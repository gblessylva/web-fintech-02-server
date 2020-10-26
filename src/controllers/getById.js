const { populate } = require("../models/Business");
const Business = require("../models/Business");

const getBusinessById =  async (req, res, next) => {
    const _id =req.params.id
    try {
        const business = await Business.findById({_id})
        .select('annualIncome businessName location numberOfEmployees category businessDescription registrationID')
        .populate('verifyDocs')
        .populate(
            {path:"projects", model:"Project", select: 'amountNeeded projectName  projectDescription projectDuration', 
                })
        .populate({path: "mileStones", model: "Milestones"})
        .populate({path:"userID", select: "role username", populate:{ path:"profile", select:"firstName lastName"}})
        if (!business) {
            res.status(404).json({
                error: "No such Business Exists"
            })
        } else {
            res.status(200).json({
            business
        })
        }        
    } catch (err) {
        res.status(404).json({
            error: "No such Business Exists -- Server"
        })
    }
    
  }


module.exports ={
    getBusinessById
}

