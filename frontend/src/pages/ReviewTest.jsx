import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Check, Edit, Trash2, Loader2 } from 'lucide-react';

function QuestionCard({ q, testId, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: q.text,
    options: [...q.options],
    correctAnswer: q.correctAnswer
  });

  const handleOptionChange = (idx, val) => {
    const newOptions = [...formData.options];
    newOptions[idx] = val;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/tests/${testId}/questions/${q.id}`, formData);
      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save question');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this question?')) return;
    setLoading(true);
    try {
      await api.delete(`/tests/${testId}/questions/${q.id}`);
      onDelete(q.id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete question');
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="card mb-4 border-l-4 border-l-blue-500 relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Question Text</label>
            <textarea
              className="input-field w-full h-24"
              value={formData.text}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.options.map((opt, idx) => (
              <div key={idx}>
                <label className="block text-sm text-gray-400 mb-1">Option {idx + 1}</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={opt}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Correct Answer</label>
            <select
              className="input-field w-full"
              value={formData.correctAnswer}
              onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
            >
              {formData.options.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Select the exact option text that is correct.</p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-400 hover:text-white" disabled={loading}>Cancel</button>
            <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4 hover:shadow-lg transition-shadow group relative pr-20 bg-dark-900 border border-dark-700">
      <div className="absolute top-4 right-4 flex space-x-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-primary-400 bg-dark-800 border border-dark-700 rounded-lg transition-colors" title="Edit">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-400 bg-dark-800 border border-dark-700 rounded-lg transition-colors" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold
            ${q.difficulty === 'EASY' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              q.difficulty === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {q.difficulty}
          </span>
          <span className="text-xs text-gray-400 border border-gray-700 px-3 py-1 rounded-full bg-dark-800">{q.subTopic}</span>
        </div>
      </div>

      <p className="text-lg text-gray-200 mb-6 font-medium leading-relaxed">{q.text}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {q.options.map((opt, idx) => (
          <div key={idx} className={`p-4 rounded-xl border transition-colors ${opt === q.correctAnswer ? 'border-primary-500 bg-primary-500/10 text-primary-200 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' : 'border-dark-700 bg-dark-800 text-gray-400'}`}>
            <span>{opt}</span>
            {opt === q.correctAnswer && <Check className="w-5 h-5 inline-block ml-2 text-primary-500 float-right" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    console.log("Fetching test with ID:", testId);
    api.get(`/tests/${testId}`)
      .then(res => {
        console.log("Fetched Data:", res.data);
        setTest(res.data);
        setQuestions(res.data.questions || []);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load test questions.');
      })
      .finally(() => setLoading(false));
  }, [testId]);

  const handleUpdate = (updatedQ) => {
    setQuestions(questions.map(q => q.id === updatedQ.id ? updatedQ : q));
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.patch(`/tests/${testId}/publish`);
      navigate('/teacher/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to publish test.');
      setPublishing(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400 flex flex-col items-center"><Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" /> Loading questions...</div>;
  if (!test) return <div className="text-center py-20 text-red-400">Test not found.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-2 tracking-tight">Review Generated Questions</h2>
        <p className="text-gray-400 text-lg">
          <span className="text-primary-400">{test.title}</span> • {test.subject} • {questions.length} Questions
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} q={q} testId={testId} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
        {questions.length === 0 && (
          <div className="text-center py-12 text-gray-500 card border-dashed border-2 border-dark-700 bg-transparent">
            No questions found for this test.
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-900/90 backdrop-blur-md border-t border-dark-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 flex justify-center">
        <button
          onClick={handlePublish}
          disabled={publishing || questions.length === 0}
          className="btn-primary w-full max-w-md py-4 text-lg font-bold shadow-lg shadow-primary-500/20 flex justify-center items-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {publishing ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Check className="w-6 h-6 mr-2" />}
          Publish Test Now
        </button>
      </div>
    </div>
  );
}
