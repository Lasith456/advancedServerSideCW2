const authRouter = require('express').Router();
const authController=require('../controller/authController');

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);


module.exports=authRouter;