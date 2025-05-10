import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';

function UserBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBlogs = () => {
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
  };

  useEffect(() => {
    fetchBlogs();
    console.log(blogs)
  }, []);

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const token = Cookies.get('token');
      await axios.delete(`http://localhost:3000/blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Blog deleted successfully.');
      fetchBlogs(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete blog.');
    }
  };

 

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Your Blogs</h2>


        <div className="text-center">
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Blog
          </button>
        </div>


      {blogs.length > 0 && (
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

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Read More →
                  </Link>

                  <div className="flex space-x-3">
                    <Link
                      to={`/blog/edit/${blog.id}`}
                      className="text-yellow-600 text-sm hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBlogs;
