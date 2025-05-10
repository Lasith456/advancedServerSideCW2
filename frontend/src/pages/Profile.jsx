import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Profile() {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [feedBlogs, setFeedBlogs] = useState([]);
  const userEmail = Cookies.get('userEmail');
  const token = Cookies.get('token');

  useEffect(() => {
    if (!userEmail || !token) return;

    axios.get(`http://localhost:3000/user/followers/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setFollowers(res.data.followers))
    .catch(err => console.error('Failed to fetch followers:', err));

    axios.get(`http://localhost:3000/user/following/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setFollowing(res.data.following))
    .catch(err => console.error('Failed to fetch following:', err));

    // axios.get(`http://localhost:3000/blog/followed-feed`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    // .then(res => setFeedBlogs(res.data.data))
    // .catch(err => console.error('Failed to fetch blog feed:', err));
  }, [userEmail, token]);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">👤 Profile</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Followers</h2>
        <ul className="list-disc list-inside">
          {followers.length > 0 ? followers.map((f, i) => <li key={i}>{f}</li>) : <p className="text-gray-500">No followers yet.</p>}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Following</h2>
        <ul className="list-disc list-inside">
          {following.length > 0 ? following.map((f, i) => <li key={i}>{f}</li>) : <p className="text-gray-500">You are not following anyone.</p>}
        </ul>
      </div>

      {/* <div>
        <h2 className="text-xl font-semibold mb-4">📰 Feed from Followed Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedBlogs.length > 0 ? feedBlogs.map(blog => (
            <div key={blog.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {blog.image && (
                <img
                  src={`http://localhost:3000/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600">By {blog.author}</p>
                <p className="text-sm text-gray-500">{blog.country}</p>
                <p className="text-sm mt-2 line-clamp-3">{blog.content}</p>
              </div>
            </div>
          )) : <p className="text-gray-500">No blog posts from followed users yet.</p>}
        </div>
      </div> */}
    </div>
  );
}

export default Profile;
