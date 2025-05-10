import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function BlogDetails() {
  const { id } = useParams(); 
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [userReaction, setUserReaction] = useState(null); 
  useEffect(() => {
    axios.get(`http://localhost:3000/blog/${id}/reaction`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUserReaction(res.data.reaction))
    .catch(() => setUserReaction(null));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:3000/blog/${id}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error("Comments load error", err));

    axios.get(`http://localhost:3000/blog/${id}/likes`)
      .then(res => {
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
      });
    axios.get(`http://localhost:3000/blog/${id}`)
      .then((res) => {
        setBlog(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load blog');
      });
  }, [id]);
  const token = Cookies.get('token');
  const handleLike = () => {
    axios.post(`http://localhost:3000/blog/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setLikes(prev => parseInt(prev) + 1));
  };

  const handleDislike = () => {
    axios.post(`http://localhost:3000/blog/${id}/dislike`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setDislikes(prev => parseInt(prev) + 1));
  };
  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    axios.post(`http://localhost:3000/blog/${id}/comment`, {
      text: comment
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setComments(prev => [...prev, { comment_text: comment }]);
      setComment('');
    });
  };

  if (error) {
    return <p className="text-red-600 text-center mt-8">{error}</p>;
  }

  if (!blog) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-600 mb-1">Author: {blog.author_email}</p>
      <p className="text-gray-500 mb-4">Country: {blog.country}</p>
      {blog.visited_date && (
        <p className="text-sm text-gray-500">Visited on: {new Date(blog.visited_date).toLocaleDateString()}</p>
      )}

      {blog.image && (
        <img
          src={`http://localhost:3000/${blog.image}`}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}

      <p className="text-gray-800 text-lg whitespace-pre-wrap">{blog.content}</p>
      <div className="mt-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleLike}
            disabled={userReaction === 'like'}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              userReaction === 'like' ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            👍 Like ({likes})
          </button>
          <button
            onClick={handleDislike}
            disabled={userReaction === 'dislike'}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              userReaction === 'dislike' ? 'bg-gray-200 text-gray-500' : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            👎 Dislike ({dislikes})
          </button>
        </div>

        <form onSubmit={handleComment} className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded mb-2"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
            Post Comment
          </button>
        </form>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Comments:</h4>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((c, idx) => (
              <div key={idx} className="p-2 border rounded bg-gray-50 text-sm">
                {c.comment_text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
