import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Link } from 'react-router-dom';

function UserBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    axios.get(`http://localhost:3000/blog/personalblogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setBlogs(res.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch blogs.');
      });
  }, []);

  if (error) {
    return <p className="text-red-600 text-center mt-6">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {blog.image && (
              <img
                src={`http://localhost:3000/${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-1">Country: {blog.country}</p>
              <p className="text-sm text-gray-700 line-clamp-3">{blog.content}</p>
              <Link to={`/blog/${blog.id}`} className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserBlogs;
