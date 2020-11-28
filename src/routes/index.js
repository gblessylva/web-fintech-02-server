const express = require('express')
const User = require('../models/Users')
const router = express.Router()
const {homeRoute, getUsersRoute, getUserByID, getProjects, 
    getProfile, getBusiness, verifyPendingUser, verifiedAccount, getMilestones } = require('../controllers/getControllers');
const {
    postNewUser, postBusiness, postProject, postMilestone, 
    registerSME, signIn, expiredActivationLink, getPasswordResetCode, verifyPasswordResetcode, verifySMEDocs

} = require('../controllers/postControllers');
const {deleteOneUser} = require('../controllers/deleteControllers')
const {patchUserByID, patchBusinessById} = require('../controllers/patchControllers')
const {putUserByID} = require('../controllers/putControllers');
const {upload, checkFiles} = require('../utilities/middleware/smeFileUploads')
const {getBusinessById} = require('../controllers/getById')
const multer = require('multer')

const send = multer({
    dest: './uploads/smeverify/'
})


//Home Route
router.get('/api/v1/', homeRoute )

//get all profile
router.get('/api/v1/profile', getProfile )

//get all Projects
router.get('/api/v1/projects', getProjects)
//Get all Users
router.get('/api/v1/milestones', getMilestones)
router.get('/api/v1/users', getUsersRoute)
//Register New User

const fiilefileds = [
    {name: 'certificate', maxCount: 1},
    {name: 'por', maxCount: 1},
    {name: 'finDoc', maxCount: 1}
];
router.post('/api/v1/users', postNewUser)
router.post('/api/v1/business', postBusiness)
router.post('/api/v1/projects', postProject)
router.post('/api/v1/milestones', postMilestone)
router.post('/api/v1/sme/register', registerSME)
router.post('/api/v1/sme/login', signIn)
router.post('/api/v1/verify-account/re-activate', expiredActivationLink)
router.post('/api/v1/auth/reset-password-code', getPasswordResetCode)
router.post('/api/v1/auth/reset-password/', verifyPasswordResetcode )
router.post('/api/v1/upload-business-docs/',  upload.fields(fiilefileds), checkFiles, verifySMEDocs )


//Get one User
router.get('/api/v1/users/:id', getUserByID)
router.get('/api/v1/auth/verify-account/:userId/:secretCode', verifyPendingUser)
router.get('/api/v1/account-verified', verifiedAccount)
router.get('/api/v1/business', getBusiness)

//Edit User
router.patch('/api/v1/users/:id', patchUserByID )
router.get('/api/v1/business/:id', getBusinessById)
router.patch('/api/v1/business/:id', patchBusinessById)
//Delete Single User

router.delete('/api/v1/users/:id', deleteOneUser)
//Suspend user

router.put('/api/v1/suspend_user/:id', putUserByID)

module.exports = router