import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function CreateTest() {
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    syllabus: '',
    divisionId: '',
    testLength: 10,
    scheduledDate: '',
    startTime: '',
    endTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/auth/divisions').then(res => setDivisions(res.data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        startTime: new Date(`${formData.scheduledDate}T${formData.startTime}:00`).toISOString(),
        endTime: new Date(`${formData.scheduledDate}T${formData.endTime}:00`).toISOString()
      };
      const res = await api.post('/tests', payload);
      navigate(`/teacher/review/${res.data.testId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create test');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          &larr; Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Adaptive Test</h2>
      </div>

      <div className="card">
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Test Title</label>
            <input type="text" name="title" className="input-field" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Scheduled Date</label>
              <input type="date" name="scheduledDate" className="input-field" value={formData.scheduledDate} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Start Time</label>
              <input type="time" name="startTime" className="input-field" value={formData.startTime} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">End Time</label>
              <input type="time" name="endTime" className="input-field" value={formData.endTime} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Subject</label>
              <input type="text" name="subject" className="input-field" value={formData.subject} onChange={handleChange} required placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Number of Questions in Test</label>
              <input type="number" name="testLength" className="input-field" value={formData.testLength} onChange={handleChange} min="1" max="20" required />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Syllabus Details (Sent to AI Prompt)</label>
            <textarea name="syllabus" className="input-field h-32 resize-none" value={formData.syllabus} onChange={handleChange} required placeholder="List the topics: Linear Equations, Polynomials..." />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Assign to Division</label>
            <select
              name="divisionId"
              className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6"
              value={formData.divisionId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a division...</option>
              {divisions.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className={`btn-primary w-full py-3 mt-6 flex justify-center items-center ${loading && 'opacity-75 cursor-not-allowed'}`}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                AI is generating question bank... please wait
              </>
            ) : 'Generate Test'}
          </button>
        </form>
      </div>
    </div>
  );
}
