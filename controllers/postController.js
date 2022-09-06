const { default: mongoose } = require('mongoose')
const { CompositionPage } = require('twilio/lib/rest/video/v1/composition')
const corsOptions = require('../config/corsOptions')
const Post = require('../model/PostModel')
const User = require('../model/userModel')

const createPost = async (req, res) => {
    const { content, image, username } = req.body
    try {
        const { profilePicture } = await User.findOne({ _id: req.params.id }).exec()

        if (profilePicture) {
            const newPost = await Post.create({
                userId: req.params.id,
                desc: content,
                image: image,
                userAvatar: profilePicture,
                username
            })
            await newPost.save()
            res.status(200).json(newPost)
        } else {
            res.status(500).json('Invalid post')
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getPost = async (req, res) => {
    const id = req.params.id

    try {
        const post = await Post.findById(id)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deletePost = async (req, res) => {
    const id = req.params.id
    const { userId } = req.body

    try {
        const post = await Post.findById(id)
        if (post.userId === userId)  {
            await post.delete()
            res.status(200).json('Post deleted.')
        } else {
            res.status(403).json('Action forbidden.')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const likePost = async (req, res) => {
    const id = req.params.id
    const { infoId: userId } = req.body

    try {
        const post = await Post.findById(id)
        if (post.likes.includes(userId)) {
            await post.updateOne({ $pull: { likes: userId }})
            res.status(200).json('Post disliked.')
        } else {
            await post.updateOne({ $push: {likes: userId }})
            res.status(200).json('Post liked')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getTimelinePosts = async (req, res) => {
    try {
        const { _id } = await User.findOne({ username: req.params.id }).exec()

        const getPost = await Post.find({ userId: _id })

        getPost.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })

        res.status(200).json(getPost)
    } catch (error) {
        res.status(500).json(error)
    }
}

const myFollowingPost = async (req, res) => {
    const userId = req.params.id
    try {
        const currentUserPosts = await Post.find({ userId: userId });

        const followingPosts = await User.aggregate([
        { 
            $match: {
            _id: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
            from: "posts",
            localField: "following",
            foreignField: "userId",
            as: "followingPosts",
            },
        },
        {
            $project: {
            followingPosts: 1,
            _id: 0,
            },
        },
        ]);

        res.status(200).json(
        currentUserPosts
            .concat(...followingPosts[0].followingPosts)
            .sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
            })
        );

    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    createPost,
    getTimelinePosts,
    myFollowingPost,
    likePost,
    getPost,
    deletePost
}