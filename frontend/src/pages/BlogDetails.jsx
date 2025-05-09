import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function BlogDetails() {
  const { id } = useParams(); 
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');

    axios.get(`http://localhost:3000/blog/${id}`)
      .then((res) => {
        setBlog(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load blog');
      });
  }, [id]);

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

      {blog.image && (
        <img
          src={`http://localhost:3000/${blog.image}`}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}

      <p className="text-gray-800 text-lg whitespace-pre-wrap">{blog.content}</p>
    </div>
  );
}

export default BlogDetails;
