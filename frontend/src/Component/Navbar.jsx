import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Navbar() {
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('userEmail');
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          <Link to="/">Lasith's Blogs</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>

          {!token ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
            </>
          ) : (
            
            <div className="relative">
              <Link to="/following-feed" className="hover:text-blue-600">Following Feed</Link>

            <Link to="/personalblogs" className="text-gray-700 hover:text-blue-500 mx-6">My Blogs</Link>
              <button
                className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
