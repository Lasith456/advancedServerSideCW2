import React, { useState } from 'react';
import axios from 'axios';

function Login({ onToggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/auth/login',
        { email, password },
        { withCredentials: true }
      );
      const user = response.data?.user?.name;
      if (user) {
        alert("Hi " + user);
      }else{
        alert("something went wrong")
      }
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          setErrorMsg(data.message || 'Invalid email or password');
        } else if (status === 500) {
          setErrorMsg('Server error, please try again later');
        } else {
          setErrorMsg(data.message || 'Unexpected error occurred');
        }
      } else if (error.request) {
        setErrorMsg('No response from server. Check your network.');
      } else {
        setErrorMsg('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3 text-sm">
            {errorMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-3 text-sm text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={onToggle}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
