import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function TeacherDashboard() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const [editingTestId, setEditingTestId] = useState(null);
  const [formData, setFormData] = useState({ scheduledDate: '', startTime: '', endTime: '' });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await api.get('/tests');
      setTests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (test) => {
    const formattedDate = test.scheduledDate ? new Date(test.scheduledDate).toISOString().split('T')[0] : '';
    const formattedStart = test.startTime ? new Date(test.startTime).toTimeString().substring(0, 5) : '';
    const formattedEnd = test.endTime ? new Date(test.endTime).toTimeString().substring(0, 5) : '';

    setFormData({
      scheduledDate: formattedDate,
      startTime: formattedStart,
      endTime: formattedEnd
    });
    setEditingTestId(test.id);
  };

  const handleEditTimings = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/tests/${editingTestId}/timings`, formData);
      setEditingTestId(null);
      fetchTests();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to edit timings");
    }
  };

  const handleDeleteTest = async (testId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this test? This will also delete all associated questions and student results. This action cannot be undone.");
    if (!isConfirmed) return;

    try {
      await api.delete(`/tests/${testId}`);
      setTests(prev => prev.filter(t => t.id !== testId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete test");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-bold">Teacher Dashboard</h2>
           <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="space-x-4">
           <button onClick={() => navigate('/teacher/create-test')} className="btn-primary">
             + Create New Test
           </button>
           <button onClick={logout} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md transition-colors text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
             Logout
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => (
          <div key={test.id} className="card hover:border-primary-500/50 transition-colors flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-primary-100">{test.title}</h3>
                {test.isPublished ? (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Published</span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">Draft</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Subject: {test.subject}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Division: {test.division?.name || 'N/A'}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Questions Limit: {test.totalQuestions}</p>

              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                 <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Scheduled: {new Date(test.scheduledDate).toLocaleDateString()}</p>
                 <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Time: {new Date(test.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - {new Date(test.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
              {!test.isPublished && (
                <button 
                  onClick={() => navigate(`/teacher/review/${test.id}`)}
                  className="w-full btn-primary py-2 text-sm font-semibold"
                >
                  Review & Edit Questions
                </button>
              )}
              {test.isPublished && (
                <button 
                  onClick={() => navigate(`/teacher/test-results/${test.id}`)} 
                  className="w-full btn-primary py-2 text-sm font-semibold"
                >
                  View Scores
                </button>
              )}
              <button 
                onClick={() => openEditModal(test)} 
                className="w-full px-3 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-700 rounded-md transition-colors text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Edit Timings
              </button>
              <button 
                onClick={() => handleDeleteTest(test.id)} 
                className="w-full px-3 py-2 text-sm font-semibold rounded-md transition-colors border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 hover:text-red-800 dark:text-red-500 dark:hover:bg-red-900/20"
              >
                Delete Test
              </button>
            </div>
          </div>
        ))}
        {tests.length === 0 && (
           <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              No tests created yet. Click "Create New Test" to get started.
           </div>
        )}
      </div>

      {editingTestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="card w-full max-w-sm bg-white dark:bg-black p-6 rounded-xl shadow-2xl">
             <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Timings</h2>
             <form onSubmit={handleEditTimings} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Scheduled Date</label>
                  <input type="date" className="input-field" value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} required/>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">Start Time</label>
                  <input type="time" className="input-field" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required/>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-400 mb-1">End Time</label>
                  <input type="time" className="input-field" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required/>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setEditingTestId(null)} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md transition-colors text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">Cancel</button>
                  <button type="submit" className="btn-primary py-2 px-4">Save Changes</button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
