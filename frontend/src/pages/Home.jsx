import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const currentUserEmail = Cookies.get('userEmail'); 
  const [followingList, setFollowingList] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {  
    axios.get('http://localhost:3000/blog/blogs')
    .then(res => setBlogs(res.data.data))
    .catch(err => console.error(err));
  }, []);
  useEffect(()=>{
    const token = Cookies.get('token');

    axios.get(`http://localhost:3000/user/following/${currentUserEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setFollowingList(res.data.following || []);
    })
    .catch((err) => {
      console.error("Failed to fetch following list", err);
    });

  })
const handleFollow = async (authorEmail) => {
  try {
    const token = Cookies.get('token');
    if(!token){
      alert('Please olgin to system and try agin');
      navigate("/login");
    }else{
       await axios.post('http://localhost:3000/user/follow', { email: authorEmail }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    }
   
  } catch (err) {
    alert(err.response?.data?.message || 'Follow failed');
  }
};

const handleUnfollow = async (authorEmail) => {
  try {
    const token = Cookies.get('token');
    await axios.post('http://localhost:3000/user/unfollow', { email: authorEmail }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    alert(err.response?.data?.message || 'Unfollow failed');
  }
};

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
               <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/blog/${blog.id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline text-sm"
                >
                  Read More →
                </Link>
              
                    <div className="flex space-x-3">
                      {blog.author !== currentUserEmail && (
                        <div className="mt-3">
                          {followingList.includes(blog.author) ? (
                            <button
                              onClick={() => handleUnfollow(blog.author)}
                              className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition"
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFollow(blog.author)}
                              className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium hover:bg-green-200 transition"
                            >
                              Follow
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
