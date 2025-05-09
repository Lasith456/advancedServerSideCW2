const blogDao = require('../dao/blogDao');

exports.getAllBlogs = (req, res) => {
    try {
      blogDao.getAllBlogs((err, blogs) => {
        if (err) {
          console.error("Error getting blogs:", err);
          return res.status(500).json({ message: "Failed to get blogs." });
        }
  
        res.status(200).json({
          message: "All Blogs retrieved successfully!",
          count: blogs.length,
          data: blogs
        });
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  exports.getBlogById = (req, res) => {
    const blogId = req.params.id;
  
    blogDao.findBlogById(blogId, (err, blog) => {
      if (err) {
        console.error("Error getting blogs:", err);
        return res.status(500).json({ message: "Database error." });
      }
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }
  
      res.status(200).json({
        message: "Blog retrieved successfully!",
        data: blog
      });
    });
  };
  exports.getBlogsByUserId = (req, res) => {
    const userId = req.user.email;
    blogDao.getBlogsByAuthorEmail(userId, (err, blogs) => {
      if (err) {
        console.error("Error fetching user's blogs:", err);
        return res.status(500).json({ message: "Database error." });
      }
  
      if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: "No blogs found for this user." });
      }
  
      res.status(200).json({
        message: "User's blogs retrieved successfully!",
        count: blogs.length,
        data: blogs
      });
    });
  };
  
exports.createBlog = (req, res) => {
  try {
    const { title, content,country } = req.body;
    const imagePath = req.file ? req.file.path : null;
    if (!title || !content ||!country) {
      return res.status(400).json({ message: "Title,Country and content are required." });
    }
    const authorEmail = req.user.email;
    blogDao.createBlog(title, content, country,imagePath, authorEmail, (err, result) => {
      if (err) {
        console.error("Error saving your blog:", err);
        return res.status(500).json({ message: "Failed to save blog to the database." });
      }
      res.status(201).json({
        message: "Blog post created successfully!",
        data: {
          id: result.insertId,
          title,
          country,
          content,
          image: imagePath,
          author: authorEmail
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content,country,imgPth } = req.body;
    const imagePath = req.file ? req.file.path : imgPth;
    const loggedInEmail = req.user.email;
    if (!title || !content ||!country) {
      return res.status(400).json({ message: "Title and content are required." });
    }
    blogDao.findBlogById(blogId, (err, blog) => {
      if (err) {
        console.error("Error getting blog:", err);
        return res.status(500).json({ message: "Error retrieving blog from sqk database." });
      }
      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }
      if (blog.author_email !== loggedInEmail) {
        return res.status(401).json({ message: "Access Denied." });
      }
      blogDao.updateBlog(blogId, title, content, country,imagePath, loggedInEmail, (err, result) => {
        if (err) {
          console.error("Error updating blog:", err);
          return res.status(500).json({ message: "Error updating blog in the database." });
        }
        res.status(200).json({
          message: "Your blog updated successfully!",
          data: {
            id: blogId,
            title,
            content,
            country,
            image: imagePath,
            author: loggedInEmail
          }
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const loggedInEmail = req.user.email;
    blogDao.findBlogById(blogId, (err, blog) => {
        if (err) {
            console.error("Error getting blog:", err);
            return res.status(500).json({ message: "Error retrieving blog from sqk database." });
          }
          if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
          }
          if (blog.author_email !== loggedInEmail) {
            return res.status(401).json({ message: "Access Denied." });
          }

      blogDao.deleteBlog(blogId, (err, result) => {
        if (err) {
          console.error("Error deleting your blog:", err);
          return res.status(500).json({ message: "Error deleting your blog." });
        }

        res.status(200).json({
          message: "Your Blog deleted successfully.",
          deletedId: blogId
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.filterBlogs = (req, res) => {
    const { author, country } = req.query;
  
    if (author && country) {
      blogDao.getBlogsByAuthorAndCountry(author, country, returnBlogs);
    } else if (author) {
      blogDao.getBlogsByAuthor(author, returnBlogs);
    } else if (country) {
      blogDao.getBlogsByCountry(country, returnBlogs);
    } else {
      return res.status(400).json({ message: "Please provide author or country or both." });
    }
      function returnBlogs(err, blogs) {
      if (err) {
        console.error("Error filtering blogs:", err);
        return res.status(500).json({ message: "Database error." });
      }
  
      res.status(200).json({
        message: "Filtered blogs retrieved!",
        count: blogs.length,
        data: blogs
      });
    }
  };
  