import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AlertCircle, Target } from 'lucide-react';

export default function StudentResults() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tests/${testId}/result`)
       .then(res => setResult(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  }, [testId]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading results...</div>;

  if (!result) return <div className="text-center py-20 text-red-400">Results not found or not completed.</div>;

  const percentage = Math.round((result.score / result.total) * 100);

  return (
    <div className="max-w-3xl mx-auto mt-10">
       <button onClick={() => navigate('/student/dashboard')} className="text-gray-400 hover:text-white transition-colors mb-6">
          &larr; Back to Dashboard
       </button>

       <div className="card text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-2">{result.test?.title}</h2>
          <p className="text-gray-400 mb-6">{result.test?.subject}</p>
          
           <div className="flex justify-center items-center">
              <div className={`w-40 h-40 flex flex-col items-center justify-center rounded-full border-8 bg-transparent shadow-xl shadow-primary-500/10 ${percentage >= 50 ? 'border-primary-500' : 'border-red-500'}`}>
                   <span className="text-4xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
                   <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.score} / {result.total} pts</span>
              </div>
           </div>
       </div>



       {result.weakTopics && Object.keys(result.weakTopics).length > 0 && (
         <div className="card border-l-4 border-l-yellow-500">
           <div className="flex items-center space-x-3 mb-6 border-b border-gray-700 pb-4">
             <AlertCircle className="text-yellow-500 w-6 h-6" />
             <h3 className="text-xl font-bold text-gray-200">Topics to Review</h3>
           </div>
           <div className="space-y-4">
             {Object.entries(result.weakTopics).map(([topic, wrongCount]) => (
                <div key={topic} className="flex justify-between items-center bg-dark-900 p-4 rounded-lg">
                   <span className="text-gray-200 font-medium">{topic}</span>
                   <span className="text-sm bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30">
                     Missed {wrongCount} question{wrongCount > 1 ? 's' : ''}
                   </span>
                </div>
             ))}
           </div>
           <p className="mt-6 text-sm text-gray-500">Focus on these areas to improve your performance in future assessments.</p>
         </div>
       )}

       {result.test?.questions && result.answers && (
         <div className="mt-10 space-y-6">
           <h3 className="text-2xl font-bold text-gray-200 mb-6 flex items-center"><Target className="w-6 h-6 text-primary-500 mr-3" /> Detailed Review</h3>
           {result.test.questions.map((q, idx) => {
             const studentAns = result.answers.find(a => a.questionId === q.id);
             const isCorrect = studentAns?.isCorrect;
             
             return (
               <div key={q.id} className={`card border-l-4 ${isCorrect ? 'border-l-primary-500' : 'border-l-red-500'}`}>
                 <div className="flex justify-between items-start mb-4">
                   <h4 className="text-lg font-medium text-gray-200"><span className="text-gray-500 mr-2">Q{idx + 1}.</span> {q.text}</h4>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                     {isCorrect ? 'Correct' : 'Incorrect'}
                   </span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                   {q.options.map((opt, oIdx) => {
                     const isSelected = studentAns?.selectedOption === opt;
                     const isActualCorrect = q.correctAnswer === opt;
                     
                     let bgClass = "bg-dark-800 border-dark-700 text-gray-400";
                     if (isActualCorrect) bgClass = "bg-primary-500/10 border-primary-500 text-primary-200 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]";
                     else if (isSelected && !isActualCorrect) bgClass = "bg-red-500/10 border-red-500 text-red-200 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]";

                     return (
                       <div key={oIdx} className={`p-4 rounded-xl border transition-colors ${bgClass} flex justify-between items-center`}>
                         <span>{opt}</span>
                         {isActualCorrect && <Target className="w-5 h-5 text-primary-500" />}
                       </div>
                     );
                   })}
                 </div>
                 
                  <div className="p-3 bg-dark-900 rounded-lg text-sm text-gray-400">
                    <span className="text-primary-400 font-semibold mb-1 block">Explanation:</span>
                    The correct answer is <span className="text-primary-300 font-medium">{q.correctAnswer}</span>. 
                    Reviewing <span className="text-yellow-400">{q.subTopic}</span> concepts will help master this topic!
                  </div>
               </div>
             );
           })}
         </div>
       )}
    </div>
  );
}
