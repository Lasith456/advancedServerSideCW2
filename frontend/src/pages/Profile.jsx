import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function Profile() {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const userEmail = Cookies.get('userEmail');
  const token = Cookies.get('token');

  useEffect(() => {
    if (!userEmail || !token) return;

    // Fetch followers
    axios.get(`http://localhost:3000/user/followers/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setFollowers(res.data.followers))
    .catch(err => console.error('Failed to fetch followers:', err));

    // Fetch following
    axios.get(`http://localhost:3000/user/following/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setFollowing(res.data.following))
    .catch(err => console.error('Failed to fetch following:', err));

    // Fetch user's personal blog posts
    axios.get(`http://localhost:3000/blog/personalblogs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUserBlogs(res.data.data))
    .catch(err => console.error('Failed to fetch user blogs:', err));
  }, [userEmail, token]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Profile Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">👤 {userEmail}</h1>
        <div className="flex gap-10 mt-3 text-gray-700 text-lg">
          <div><strong>{followers.length}</strong> Followers</div>
          <div><strong>{following.length}</strong> Following</div>
          <div><strong>{userBlogs.length}</strong> Posts</div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 My Blog Posts</h2>
        {userBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBlogs.map((blog) => (
              <div key={blog.id} className="bg-white shadow rounded overflow-hidden">
                {blog.image && (
                  <img
                    src={`http://localhost:3000/${blog.image}`}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{blog.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {blog.visited_date ? `Visited: ${new Date(blog.visited_date).toLocaleDateString()}` : ''}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">Country: {blog.country}</p>
                  <p className="text-gray-700 text-sm line-clamp-3">{blog.content}</p>
                  <Link to={`/blog/${blog.id}`} className="text-blue-600 text-sm hover:underline mt-2 inline-block">Read More →</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't posted any blogs yet.</p>
        )}
      </div>

      {/* Followers and Following Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">📥 Followers</h2>
          {followers.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {followers.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No followers yet.</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">📤 Following</h2>
          {following.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {following.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You are not following anyone.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
