import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function StudentDashboard() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get('/tests');
        setTests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTests();
  }, []);

  const handleStartTest = async (testId) => {
    try {
      const res = await api.post(`/tests/${testId}/start`);
      navigate(`/student/test/${testId}`, { state: { sessionData: res.data } });
    } catch (err) {
      console.error("Failed to start test:", err);
      alert("Could not start test. Check console.");
    }
  };

  return (
    <div className="w-full flex-1 bg-gray-50 dark:bg-black p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Student Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-100 mt-1">Hello, {user?.name}!</p>
        </div>
        <button
          onClick={logout}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md transition-colors text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Logout
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-500">Available Tests</h3>

      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => {
          const now = new Date();
          const pStart = new Date(test.startTime);
          const pEnd = new Date(test.endTime);
          const isWithinTimeWindow = now >= pStart && now <= pEnd;
          const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={test.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{test.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm flex-1">Subject: {test.subject}</p>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col justify-between items-center gap-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full text-left">{test.totalQuestions} Questions</span>

                {test.hasAttempted ? (
                  <button
                    onClick={() => navigate(`/student/results/${test.id}`)}
                    className="w-full py-3 px-5 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base sm:text-sm font-medium transition-colors"
                  >
                    View Results
                  </button>
                ) : isWithinTimeWindow ? (
                  <button
                    onClick={() => handleStartTest(test.id)}
                    className="w-full py-3 px-5 text-center bg-green-600 hover:bg-green-700 text-white rounded-md text-base sm:text-sm font-medium transition-colors shadow-sm"
                  >
                    Start Test
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-5 text-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed rounded-md text-base sm:text-sm font-medium transition-colors"
                  >
                    {now < pStart ? `Scheduled for: ${formatTime(pStart)}` : 'Test Ended'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {tests.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full">
            No tests are currently assigned to your division.
          </div>
        )}
      </div>
    </div>
  );
}
