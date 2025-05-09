import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token'); 
  
    axios.get('http://localhost:3000/blog/blogs')
    .then(res => setBlogs(res.data.data))
    .catch(err => console.error(err));
  }, []);
  

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
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
              <p className="text-sm text-gray-600 mb-1">Author: {blog.author}</p>
              <p className="text-sm text-gray-500 mb-1">Country: {blog.country}</p>
              <p className="text-gray-700 text-sm line-clamp-3">{blog.content}</p>
              <Link
                to={`/blog/${blog.id}`}
                className="inline-block mt-4 text-blue-600 hover:underline text-sm"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
