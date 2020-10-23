const express = require('express')
const User = require('../models/Users')
const router = express.Router()
const {homeRoute, getUsersRoute, getUserByID, getProjects, getProfile, getBusiness, verifyPendingUser, verifiedAccount } = require('../controllers/getControllers');
const {postNewUser, postBusiness, postProject, postMilestone, registerSME, signIn} = require('../controllers/postControllers');
const {deleteOneUser} = require('../controllers/deleteControllers')
const {patchUserByID} = require('../controllers/patchControllers')
const {putUserByID} = require('../controllers/putControllers');
const { sign } = require('jsonwebtoken');


//Home Route
router.get('/api/v1/', homeRoute )

//get all profile
router.get('/api/v1/profile', getProfile )

//get all Projects
router.get('/api/v1/projects', getProjects)
//Get all Users
router.get('/api/v1/users', getUsersRoute)
//Register New User

router.post('/api/v1/users', postNewUser)
router.post('/api/v1/business', postBusiness)
router.post('/api/v1/projects', postProject)
router.post('/api/v1/milestones', postMilestone)
router.post('/api/v1/sme/register', registerSME)
router.post('/api/v1/sme/login', signIn)
router.get('/api/v1/business', getBusiness)
//Get one User
router.get('/api/v1/users/:id', getUserByID)
router.get('/api/v1/auth/verify-account/:userId/:secretCode', verifyPendingUser)
router.get('/api/v1/account-verified', verifiedAccount)

//Edit User
router.patch('/api/v1/users/:id', patchUserByID )

//Delete Single User

router.delete('/api/v1/users/:id', deleteOneUser)
//Suspend user

router.put('/api/v1/suspend_user/:id', putUserByID)

module.exports = router