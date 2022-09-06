const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController')

router.get('/:id', userController.getUser)
router.get('/', userController.getAllUsers)
router.delete('/:id', userController.deleteUser)
router.put('/:id/follow', userController.followUser)
router.put('/:id/unfollow', userController.unfollowUser)
router.put('/updateUser/:id', userController.updateUser)
router.get('/usersToFollow', userController.getUsersToFollow)
router.get('/utf/1', userController.getUsersToFollow)

module.exports = router