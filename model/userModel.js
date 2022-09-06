const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require: true
        }, 
        password: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profilePicture: String,
        coverPicture: String,
        about: String,
        followers: [],
        following: [],
        refreshToken: String
    },
    {timestamps: true}
)

module.exports = mongoose.model('Users', UserSchema)