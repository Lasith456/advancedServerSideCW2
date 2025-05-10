const express = require('express');
const likeCommentrouter = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const likeCommentController = require('../controller/LikeCommentController');

likeCommentrouter.post('/:id/like', verifyToken, likeCommentController.likeBlog);
likeCommentrouter.post('/:id/dislike', verifyToken, likeCommentController.dislikeBlog);
likeCommentrouter.post('/:id/comment', verifyToken, likeCommentController.commentOnBlog);
likeCommentrouter.get('/:id/comments', likeCommentController.getComments);
likeCommentrouter.get('/:id/likes', likeCommentController.getLikeDislikeCounts);
likeCommentrouter.get('/:id/reaction', verifyToken, likeCommentController.getUserReaction);

module.exports = likeCommentrouter;
