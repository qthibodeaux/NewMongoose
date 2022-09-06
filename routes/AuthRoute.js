const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/register', authController.registerUser)
router.post('/', authController.loginUser)
router.post('/hello', (req, res) => res.send("This hit the auth route controller"))

module.exports = router