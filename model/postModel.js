const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId: { type: String, requried: true},
    username: String,
    userAvatar: String,
    desc: String,
    likes: [],
    createdAt: {
        type: Date,
        default: new Date(),
    },
    image: String,
},{timestamps: true})

module.exports = mongoose.model('Posts',postSchema)