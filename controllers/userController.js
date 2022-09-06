const User = require('../model/userModel');

const getUser = async(req, res) => {
    const id = req.params.id

    try {
        const user = await User.findById(id)
        if (user) {
            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json('Could not find user')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getUsersToFollow = async (req, res) => {
    try {
            let users = await User.find();
            users = users.map((user)=>{
            const { password, ...otherDetails } = user._doc
                return otherDetails
            })
            const newArr = users.slice(0,4)
            res.status(200).json(newArr)
    } catch (error) {
        res.status(500).json(error);
    }
}

const getAllUsers = async (req, res) => {
    try {
        let users = await User.find();
        users = users.map((user)=>{
          const { password, ...otherDetails } = user._doc
          return otherDetails
        })
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json(error);
      }
}



const deleteUser = async (req, res) => {
    const id = req.params.id

    const { currentUserId, currentUserAdmin } = req.body

    if (currentUserId === id || currentUserAdmin) {
        try {
            await User.findByIdAndDelete(id)
            res.status(200).son('User Deleted Successfully.')
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access denied.")
    }
}

const followUser = async (req, res) => {
    const id = req.params.id;
  const { _id } = req.body;
  
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await User.findById(id);
      const followingUser = await User.findById(_id);

      if (!followUser.following.includes(_id)) {
        await followingUser.updateOne({ $push: { followers: id } });
        await followUser.updateOne({ $push: { following: _id } });
        res.status(200).json("User followed!");
      } else {
        await followingUser.updateOne({$pull : {followers: id}})
        await followUser.updateOne({$pull : {following: _id}})
        res.status(200).json("Unfollowed Successfully!")
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
}

const unfollowUser = async (req, res) => {
    const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const unFollowUser = await User.findById(id)
      const unFollowingUser = await User.findById(_id)


      if (unFollowUser.followers.includes(_id))
      {
        await unFollowUser.updateOne({$pull : {followers: _id}})
        await unFollowingUser.updateOne({$pull : {following: id}})
        res.status(200).json("Unfollowed Successfully!")
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

const updateUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ "message": `No user matches ID ${req.body.id}.` });
    }
    
    if (req.body?.profilePicture) user.profilePicture = req.body.profilePicture;
    if (req.body?.coverPicture) user.coverPicture = req.body.coverPicture;
    if (req.body?.about) user.about = req.body.about;

    const result = await user.save();
    res.json(result);
  };

module.exports = {
    getUser,
    getAllUsers,
    followUser,
    unfollowUser,
    deleteUser,
    updateUser,
    getUsersToFollow
}