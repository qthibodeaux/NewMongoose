const express = require('express');
const router = express.Router({ mergeParams: true});
const postController = require('../../controllers/postController')

router.post('/:id/createpost', postController.createPost)
router.get('/:id', postController.getPost)
router.delete('/:id', postController.deletePost)
router.put('/:id/like', postController.likePost)
router.get('/p/:id', postController.getTimelinePosts)
router.get('/:id/timeline', postController.myFollowingPost)

module.exports = router