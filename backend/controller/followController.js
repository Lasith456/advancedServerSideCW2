const followDao = require('../dao/followDao');
const userDao = require('../dao/userDao');
exports.follow = (req, res) => {
  const follower = req.user.email;
  const following = req.body.email; 

  if (follower === following) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  userDao.findUserByEmail(following, (err, user) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (!user) {
      return res.status(404).json({ message: "The user you're trying to follow does not exist." });
    }

    followDao.isAlreadyFollowing(follower, following, (err, isFollowing) => {
        if (err) {
          console.error("Error checking follow status:", err);
          return res.status(500).json({ message: "Database error during follow check." });
        }
  
        if (isFollowing) {
          return res.status(409).json({ message: `You already follow ${following}.` });
        }
  
        followDao.followUser(follower, following, (err, result) => {
          if (err) {
            console.error("Error following this user:", err);
            return res.status(500).json({ message: "Could not follow user." });
          }
  
          res.status(200).json({ message: `You are now following ${following}` });
        });
      });
  });
};

exports.unfollow = (req, res) => {
    const follower = req.user.email;
    const following = req.body.email;
  
    if (!following) {
      return res.status(400).json({ message: "Please provide the email of the user you want to unfollow." });
    }
    if (follower === following) {
      return res.status(400).json({ message: "You can't unfollow yourself." });
    }
    userDao.findUserByEmail(following, (err, user) => {
      if (err) {
        console.error("Error checking user existence:", err);
        return res.status(500).json({ message: "Database error." });
      }
      if (!user) {
        return res.status(404).json({ message: "The user you're trying to unfollow does not exist." });
      }
      followDao.isAlreadyFollowing(follower, following, (err, isFollowing) => {
        if (err) {
          console.error("Error checking follow status:", err);
          return res.status(500).json({ message: "Database error during follow check." });
        }
        if (!isFollowing) {
          return res.status(409).json({ message: `You are not following ${following}.` });
        }
        followDao.unfollowUser(follower, following, (err, result) => {
          if (err) {
            console.error("Error unfollowing user:", err);
            return res.status(500).json({ message: "Could not unfollow user." });
          }
  
          res.status(200).json({ message: `You unfollowed ${following}` });
        });
      });
    });
  };

exports.getFollowers = (req, res) => {
  const email = req.params.email;

  followDao.getFollowers(email, (err, result) => {
    if (err) return res.status(500).json({ message: "DB error." });
    res.status(200).json({ followers: result.map(row => row.follower_email) });
  });
};

exports.getFollowing = (req, res) => {
  const email = req.params.email;

  followDao.getFollowing(email, (err, result) => {
    if (err) return res.status(500).json({ message: "DB error." });
    res.status(200).json({ following: result.map(row => row.following_email) });
  });
};
