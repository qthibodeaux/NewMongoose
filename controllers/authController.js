const User = require('../model/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const loginUser = async (req, res) => {
    const {email, password} = req.body
    const foundUser = await User.findOne({ email })
    if(!foundUser) return res.json({ msg: 'The email was not found'})

    const match = await bcrypt.compare(password, foundUser.password)
    if(match) {
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                }
            },
            process.env.ACCESS_TOKEN_SECRET
        )
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET
        )
        const { username, _id, profilePicture, coverPicture, about, following, followers } = foundUser
        const profile = { profilePicture, coverPicture, about, following: following.length, followers: followers.length }
        foundUser.refreshToken = refreshToken
        await foundUser.save()

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 *100})
        res.json({ accessToken, username, _id, profile })
    } else {
        res.sendStatus(401)
    }
}

const registerUser = async (req, res) => {
    const { username, password, email } = req.body

    const duplicate = await User.findOne({ username }).exec()
    if (duplicate) return res.json({ msg: 'The username has been taken'})

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": email,
                }
            },
            process.env.ACCESS_TOKEN_SECRET
        )

        const refreshToken = jwt.sign(
            { "email": email },
            process.env.REFRESH_TOKEN_SECRET
        )

        const result = await User.create({
            username,
            password: hashPassword,
            email,
            refreshToken,
            profilePicture: 'https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg',
            coverPicture: 'https://cdn.pixabay.com/photo/2013/08/28/11/47/leaf-176722__340.jpg',
            about: 'Tell us about yourself',
        })

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 *100})
        res.json({accessToken, username})
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { loginUser, registerUser }