const db = require('../config/db'); 

const getAllBlogs = (callback) => {
    const sql = `
      SELECT id, title, content, country,image, author_email AS author, created_at
      FROM blogs
      ORDER BY created_at DESC
    `;
    db.query(sql, callback);
  };

const createBlog = (title, content, country, image, authorEmail, visitedDate, callback) => {
  const sql = `
    INSERT INTO blogs (title, content, country, image, author_email, visited_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, content, country, image, authorEmail, visitedDate], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

const findBlogById = (id, callback) => {
    const sql = "SELECT * FROM blogs WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.length > 0 ? results[0] : null);
  });
}
  
const updateBlog = (id, title, content, country,image, authorEmail, callback) => {
    const sql = `
      UPDATE blogs
      SET title = ?, content = ?, country = ?, image = ?
      WHERE id = ? AND author_email = ?
    `;
    db.query(sql, [title, content, country,image, id, authorEmail], callback);
};
const deleteBlog = (id, callback) => {
    const sql = "DELETE FROM blogs WHERE id = ?";
    db.query(sql, [id], callback);
  };

  const getBlogsByAuthor = (author, callback) => {
    const sql = "SELECT * FROM blogs WHERE author_name LIKE ? ORDER BY created_at DESC";
    db.query(sql, [`%${author}%`], callback);
  };
  const getBlogsByAuthorEmail = (author, callback) => {
    const sql = "SELECT * FROM blogs WHERE author_email LIKE ? ORDER BY created_at DESC";
    db.query(sql, [`%${author}%`], callback);
  };
  const getBlogsByCountry = (country, callback) => {
    const sql = "SELECT * FROM blogs WHERE country = ? ORDER BY created_at DESC";
    db.query(sql, [country], callback);
  };
  
  const getBlogsByAuthorAndCountry = (author, country, callback) => {
    const sql = "SELECT * FROM blogs WHERE author_name LIKE ? AND country = ? ORDER BY created_at DESC";
    db.query(sql, [`%${author}%`, country], callback);
  };
  const filterBlogs = (sql, values, callback) => {
  db.query(sql, values, callback);
};

module.exports = {
  createBlog,
  findBlogById,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogsByAuthor,
  getBlogsByCountry,
  getBlogsByAuthorAndCountry,
  getBlogsByAuthorEmail,
  filterBlogs
};
