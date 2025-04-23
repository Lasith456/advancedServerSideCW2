const express = require('express');
const followRouter = express.Router();
const followController = require('../controller/followController');
const verifyToken = require('../middleware/authMiddleware');

followRouter.post('/follow', verifyToken, followController.follow);
followRouter.post('/unfollow', verifyToken, followController.unfollow);
followRouter.get('/followers/:email', followController.getFollowers);
followRouter.get('/following/:email', followController.getFollowing);

module.exports = followRouter;
