import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'TEACHER') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-full mt-20">
      <div className="card w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Welcome Back</h2>
        {error && <div className="bg-red-100 border border-red-500 text-red-700 dark:bg-red-500/20 dark:text-red-100 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-6 py-3 text-lg shadow-lg shadow-primary-500/30">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
          Need an account? <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
