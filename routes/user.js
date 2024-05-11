const express = require('express')

const router = express.Router()

const {signupUser,loginUser}=require('../controllers/userController')

//login routes
router.post('/login',loginUser)


//signup routes
router.post('/signup', signupUser)

module.exports = router