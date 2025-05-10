import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [error, setError] = useState('');
  const [visitedDate, setVisitedDate] = useState('');

  const token = Cookies.get('token');

  useEffect(() => {
    axios
      .get(`http://localhost:3000/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const blog = res.data.data;
        setTitle(blog.title);
        setCountry(blog.country);
        setContent(blog.content);
        setExistingImage(blog.image); // Save existing image path
      })
      .catch((err) => {
        setError('Failed to load blog.');
        console.error(err);
      });
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('country', country);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    } else {
      formData.append('imgPth', existingImage); // Send existing image path
    }

    try {
      await axios.put(`http://localhost:3000/blog/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Blog updated successfully!');
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update blog.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Blog</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-32"
          required
        ></textarea>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        {existingImage && !image && (
          <img
            src={`http://localhost:3000/${existingImage}`}
            alt="Current"
            className="w-full h-48 object-cover rounded"
          />
        )}

        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
