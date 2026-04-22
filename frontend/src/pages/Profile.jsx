import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, updatePassword, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    try {
      await updatePassword(oldPassword, newPassword);
      setMessage('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h2>
          <button onClick={handleLogout} className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md font-medium transition-colors">
            Log Out
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Account Information</h3>
          <p className="text-gray-600 dark:text-gray-400"><span className="font-medium text-gray-800 dark:text-gray-200">Name:</span> {user.name}</p>
          <p className="text-gray-600 dark:text-gray-400"><span className="font-medium text-gray-800 dark:text-gray-200">Role:</span> {user.role}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Update Password</h3>
          {error && <div className="bg-red-100 border border-red-500 text-red-700 dark:bg-red-500/20 dark:text-red-100 p-3 rounded mb-4">{error}</div>}
          {message && <div className="bg-green-100 border border-green-500 text-green-700 dark:bg-green-500/20 dark:text-green-100 p-3 rounded mb-4">{message}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Current Password</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="input-field max-w-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field max-w-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field max-w-md" required />
            </div>
            <button type="submit" className="btn-primary mt-6">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
