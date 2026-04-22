import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function TeacherTestResults() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/tests/${testId}/results`);
        setResults(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [testId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading scores...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
          &larr; Back to Dashboard
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Student Marks</h2>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Enrollment Number
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Completed At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-900 divide-y divide-gray-200 dark:divide-gray-700">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No students have completed this test yet.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {result.student?.enrollmentNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {result.student?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200">
                        {result.score} / {result.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(result.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
