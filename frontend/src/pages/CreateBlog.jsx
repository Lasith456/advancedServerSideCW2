import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [visitedDate, setVisitedDate] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch countries on component mount
    axios.get('https://restcountries.com/v3.1/all')
      .then(res => {
        const sortedCountries = res.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      })
      .catch(err => console.error('Failed to fetch countries', err));
  }, []);

  const handleCountryChange = (e) => {
    const selected = countries.find(
      (c) => c.name.common === e.target.value
    );
    setCountry(selected?.name.common || '');
    setSelectedCountry(selected || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !country || !content) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('country', country);
    formData.append('content', content);
    formData.append('visited_date', visitedDate);
    if (image) formData.append('image', image);

    try {
      const token = Cookies.get('token');
      const response = await axios.post('http://localhost:3000/blog', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create blog.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Blog</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          onChange={handleCountryChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.cca3} value={c.name.common}>
              {c.name.common}
            </option>
          ))}
        </select>

        {selectedCountry && (
          <div className="bg-gray-50 p-4 rounded border text-sm">
            <p><strong>Capital:</strong> {selectedCountry.capital?.[0] || 'N/A'}</p>
            <p><strong>Currency:</strong> {Object.values(selectedCountry.currencies || {})[0]?.name || 'N/A'}</p>
            <img src={selectedCountry.flags.svg} alt="flag" className="w-20 mt-2" />
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700">Visited Date</label>
        <input
          type="date"
          value={visitedDate}
          onChange={(e) => setVisitedDate(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
