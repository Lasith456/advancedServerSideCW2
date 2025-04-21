const db = require('../config/db');
const checkEmailExists = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.length > 0);
    });
  };
const createUser = (name, email, hashedPassword, callback) => {
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};
const findUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]); 
    });
  };
module.exports = {
  createUser,checkEmailExists,findUserByEmail
};
