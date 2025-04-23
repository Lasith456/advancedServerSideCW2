const db = require('../config/db');

const followUser = (followerEmail, followingEmail, callback) => {
  const sql = "INSERT INTO followers (follower_email, following_email) VALUES (?, ?)";
  db.query(sql, [followerEmail, followingEmail], callback);
};

const unfollowUser = (followerEmail, followingEmail, callback) => {
  const sql = "DELETE FROM followers WHERE follower_email = ? AND following_email = ?";
  db.query(sql, [followerEmail, followingEmail], callback);
};

const getFollowing = (followerEmail, callback) => {
  const sql = "SELECT following_email FROM followers WHERE follower_email = ?";
  db.query(sql, [followerEmail], callback);
};

const getFollowers = (followingEmail, callback) => {
  const sql = "SELECT follower_email FROM followers WHERE following_email = ?";
  db.query(sql, [followingEmail], callback);
};
const isAlreadyFollowing = (followerEmail, followingEmail, callback) => {
    const sql = "SELECT * FROM followers WHERE follower_email = ? AND following_email = ?";
    db.query(sql, [followerEmail, followingEmail], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.length > 0); 
  });
}
module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isAlreadyFollowing
};
