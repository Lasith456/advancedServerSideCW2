import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function FollowingFeed() {
  const [feedBlogs, setFeedBlogs] = useState([]);
  const [error, setError] = useState('');
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:3000/blog/following-feed', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setFeedBlogs(res.data.blogs);
    })
    .catch((err) => {
      setError(err.response?.data?.message || 'Failed to load feed.');
    });
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">📢 Following Feed</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {feedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedBlogs.map((blog) => (
            <div key={blog.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {blog.image && (
                <img
                  src={`http://localhost:3000/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{blog.title}</h3>
                <p className="text-sm text-gray-500 mb-1">By: {blog.author_email}</p>
                <p className="text-sm text-gray-500 mb-1">
                  {blog.visited_date ? `Visited: ${new Date(blog.visited_date).toLocaleDateString()}` : ''}
                </p>
                <p className="text-sm text-gray-600 mb-2">Country: {blog.country}</p>
                <p className="text-gray-700 text-sm line-clamp-3">{blog.content}</p>
                <Link to={`/blog/${blog.id}`} className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No posts from people you follow yet.</p>
      )}
    </div>
  );
}

export default FollowingFeed;
