import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [role, setRole] = useState('STUDENT'); // STUDENT | TEACHER
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Student specifics
  const [divisionId, setDivisionId] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  
  const [divisions, setDivisions] = useState([]);
  const [error, setError] = useState(null);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'STUDENT') {
      api.get('/auth/divisions').then(res => setDivisions(res.data)).catch(err => console.error(err));
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { role, name, email, password };
      if (role === 'STUDENT') {
        payload.divisionId = divisionId;
        payload.enrollmentNumber = enrollmentNumber;
        payload.rollNumber = rollNumber;
      } else if (role === 'TEACHER') {
        payload.enrollmentNumber = enrollmentNumber;
      }
      console.log("FRONTEND PAYLOAD:", { ...payload });
      await register(payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-full mt-10 mb-10">
      <div className="card w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Create Account</h2>
        
        <div className="flex bg-gray-200 dark:bg-dark-900 p-1 rounded-md mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'STUDENT' ? 'bg-white dark:bg-dark-800 shadow text-primary-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            onClick={() => setRole('STUDENT')}
          >
            Student
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'TEACHER' ? 'bg-white dark:bg-dark-800 shadow text-primary-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            onClick={() => setRole('TEACHER')}
          >
            Teacher
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-500 text-red-700 dark:bg-red-500/20 dark:text-red-100 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Full Name</label>
            <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email Address</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {role === 'STUDENT' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Division</label>
                <select
                  className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6"
                  value={divisionId}
                  onChange={e => setDivisionId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Division</option>
                  {divisions.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Enrollment Number</label>
                  <input type="text" className="input-field" value={enrollmentNumber} onChange={e => setEnrollmentNumber(e.target.value)} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Roll Number</label>
                  <input type="text" className="input-field" value={rollNumber} onChange={e => setRollNumber(e.target.value)} required />
                </div>
              </div>
            </>
          )}

          {role === 'TEACHER' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Enrollment Number</label>
              <input type="text" className="input-field" value={enrollmentNumber} onChange={e => setEnrollmentNumber(e.target.value)} required />
            </div>
          )}

          <button type="submit" className="btn-primary w-full mt-6 py-3 text-lg shadow-lg shadow-primary-500/30">
            Sign Up
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-600 dark:text-gray-500 text-sm">
          Already have an account? <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
