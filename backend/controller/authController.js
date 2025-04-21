const bcrypt = require('bcrypt');
const userDao = require('../dao/userDao');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      userDao.checkEmailExists(email, (checkErr, exists) => {
        if (checkErr) {
          console.error("Email check failed:", checkErr);
          return res.status(500).json({ message: "Database error" });
        }
        if (exists) {
          return res.status(400).json({ message: "Email is already in use! Please try again another Email" });
        }
        userDao.createUser(name, email, hashedPassword, (insertErr, result) => {
          if (insertErr) {
            console.error("DB Insert Error:", insertErr);
            return res.status(500).json({ message: "Something went wrong failed to register user" });
          }
          res.status(201).json({ message: "User registered successfully.", userId: result.insertId });
        });
      });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  exports.login = (req, res) => {
    const { email, password } = req.body;
  
    userDao.findUserByEmail(email, async (err, user) => {
      if (err) {
        console.error("DB error during login:", err);
        return res.status(500).json({ message: "Database error" });
      }
      if (!user) {
        return res.status(401).json({ message: "User is Not Found in that Email." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    });
  };