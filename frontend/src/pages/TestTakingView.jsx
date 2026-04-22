import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function TestTakingView() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // sessionData comes from StudentDashboard when we hit /start
  const [sessionData, setSessionData] = useState(location.state?.sessionData || null);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!sessionData) {
    return <div className="text-center py-20 text-gray-400">Loading session or invalid state. Please go back to dashboard.</div>;
  }

  const { sessionId, question, attemptedCount, totalQuestions } = sessionData;

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);

    try {
      const res = await api.post(`/tests/${testId}/submit-answer`, {
        sessionId,
        questionId: question.id,
        selectedOption
      });

      if (res.data.status === 'FINISHED') {
         // Test is over
         navigate(`/student/results/${testId}`);
      } else if (res.data.status === 'CONTINUE') {
         // Load next question into state
         setSessionData({
           sessionId,
           question: res.data.question,
           attemptedCount: res.data.attemptedCount,
           totalQuestions: res.data.totalQuestions
         });
         setSelectedOption('');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 sm:mt-10 px-4 sm:px-0">
      <div className="card w-full border-primary-500/20 shadow-primary-500/10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-gray-700 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-2 sm:mb-0">
            Question {attemptedCount + 1} <span className="text-sm font-normal text-gray-500">of {totalQuestions}</span>
          </h2>
          {/* Difficulty is strictly hidden from this UI as requested */}
        </div>

        <div className="mb-6 sm:mb-8">
          <p className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100">{question.text}</p>
        </div>

        <div className="space-y-4 mb-8">
          {question.options.map((opt, idx) => (
            <label 
              key={idx} 
              className={`block p-4 sm:p-5 outline-none rounded-lg border cursor-pointer transition-colors ${
                selectedOption === opt 
                  ? 'bg-primary-50 dark:bg-primary-600/20 border-primary-500 text-primary-700 dark:text-primary-100' 
                  : 'bg-white dark:bg-dark-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="option" 
                  value={opt} 
                  checked={selectedOption === opt}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mr-3 text-primary-500 focus:ring-primary-500 bg-dark-900 border-gray-600 w-5 h-5"
                />
                <span className="text-lg">{opt}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-4 sm:mt-0">
          <button 
            onClick={handleSubmit} 
            disabled={!selectedOption || isSubmitting}
            className={`btn-primary w-full sm:w-auto px-8 py-3 sm:py-3 text-lg ${(!selectedOption || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : (attemptedCount + 1 === totalQuestions ? 'Submit Exam' : 'Next Question')}
          </button>
        </div>
      </div>
    </div>
  );
}
