const express = require('express');
const blogRouter = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const blogController=require('../controller/blogController');

blogRouter.get('/test', verifyToken, (req, res) => {res.send(`Hello ${req.user.email}, your token is live!`);});

blogRouter.get('/blogs', blogController.getAllBlogs);
blogRouter.get('/following-feed',verifyToken, blogController.getFollowingFeed);
blogRouter.get('/personalblogs', verifyToken, blogController.getBlogsByUserId);
blogRouter.get('/:id', blogController.getBlogById);
blogRouter.get('/filter/blogs', blogController.filterBlogs);

blogRouter.post('/', verifyToken, upload.single('image'), blogController.createBlog);
blogRouter.put('/:id', verifyToken, upload.single('image'), blogController.updateBlog);
blogRouter.delete('/:id', verifyToken, blogController.deleteBlog);


module.exports = blogRouter;
