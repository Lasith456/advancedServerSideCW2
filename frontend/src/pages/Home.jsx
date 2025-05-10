import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const currentUserEmail = Cookies.get('userEmail'); 
  const [followingList, setFollowingList] = useState([]); 
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [likeCounts, setLikeCounts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/blog/blogs')
      .then(async res => {
        const blogs = res.data.data;
        setBlogs(blogs);

        const likeMap = {};
        const commentMap = {};

        await Promise.all(
          blogs.map(async (blog) => {
            try {
              const likeRes = await axios.get(`http://localhost:3000/blog/${blog.id}/likes`);
              likeMap[blog.id] = likeRes.data.likes;
            } catch {
              likeMap[blog.id] = 0;
            }

            try {
              const commentRes = await axios.get(`http://localhost:3000/blog/${blog.id}/comments`);
              commentMap[blog.id] = commentRes.data.length;
            } catch {
              commentMap[blog.id] = 0;
            }
          })
        );

        setLikeCounts(likeMap);
        setCommentCounts(commentMap);
      })
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
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
  }, []);

  const handleFollow = async (authorEmail) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('Please login to the system and try again');
        navigate("/login");
      } else {
        await axios.post('http://localhost:3000/user/follow', { email: authorEmail }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowingList(prev => [...prev, authorEmail]);
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
      setFollowingList(prev => prev.filter(email => email !== authorEmail));
    } catch (err) {
      alert(err.response?.data?.message || 'Unfollow failed');
    }
  };

  const handleSearch = () => {
    const params = {};
    if (searchTitle) params.title = searchTitle;
    if (searchAuthor) params.author = searchAuthor;
    if (searchCountry) params.country = searchCountry;
    if (searchDate) params.visited_date = searchDate;

    axios.get('http://localhost:3000/blog/filter/blogs', { params })
      .then(res => setBlogs(res.data.data))
      .catch(err => {
        console.error(err);
        alert("No matching blogs found.");
      });
  };
  const sortedBlogs = blogs.slice().sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOption === 'likes') {
      return (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0);
    } else if (sortOption === 'comments') {
      return (commentCounts[b.id] || 0) - (commentCounts[a.id] || 0);
    }
    return 0;
  });


  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Author"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Country"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="newest">Newest</option>
            <option value="likes">Most Liked</option>
            <option value="comments">Most Commented</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            🔍 Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBlogs.map(blog => (
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
                  className="text-blue-600 hover:underline text-sm"
                >
                  Read More →
                </Link>

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
        ))}
      </div>
    </div>
  );
}

export default Home;
