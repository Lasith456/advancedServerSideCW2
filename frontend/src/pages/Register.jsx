import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/auth/register',
        { name, email, password },
        { withCredentials: true }
      );

      if (response.data?.userId) {
        setSuccessMsg("User registered successfully!");
        setName('');
        setEmail('');
        setPassword('');
        navigate("/login");

      }

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          setErrorMsg(data.message || "Email already in use.");
        } else if (status === 500) {
          setErrorMsg("Server error, please try again later.");
        } else {
          setErrorMsg(data.message || "Unexpected error occurred.");
        }
      } else if (error.request) {
        setErrorMsg("No response from server. Check your network.");
      } else {
        setErrorMsg("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        {errorMsg && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3 text-sm">{errorMsg}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-3 text-sm">{successMsg}</div>}

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
            loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="mt-3 text-sm text-center">
          Already have an account?{" "}
           <Link to="/login">
          <span className="text-blue-600 cursor-pointer hover:underline">
            Login
          </span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
