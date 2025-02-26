'use client';

import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import useQuestionStore from '@/store/question/addQuestionStore';
import { Period } from '@/types/Regular/question';

export default function RegularQuestionPage() {
  const {
    dailyQuestions,
    periodicQuestions,
    addDailyQuestion,
    addPeriodicQuestion,
    deleteDailyQuestion,
    deletePeriodicQuestion,
  } = useQuestionStore();

  const [newDailyQuestion, setNewDailyQuestion] = useState('');
  const [newPeriodicQuestion, setNewPeriodicQuestion] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('매주');

  const handleAddDailyQuestion = () => {
    if (newDailyQuestion.trim()) {
      addDailyQuestion(newDailyQuestion);
      setNewDailyQuestion('');
    }
  };

  const handleAddPeriodicQuestion = () => {
    if (newPeriodicQuestion.trim()) {
      addPeriodicQuestion({
        content: newPeriodicQuestion,
        period: selectedPeriod,
      });
      setNewPeriodicQuestion('');
    }
  };

  const handleKeyPress = (
    event: KeyboardEvent<HTMLInputElement>,
    addFunction: () => void,
  ) => {
    if (event.key === 'Enter') {
      addFunction();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-10 bg-white rounded-3xl shadow-xl border border-gray-200">
      <h1 className="text-4xl font-bold text-center text-gray-800 tracking-wide">
        정기 질문
      </h1>

      {/* Daily Questions Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          오늘의 질문
        </h2>
        <ul className="space-y-3">
          {dailyQuestions.map((question) => (
            <motion.li
              key={question.id}
              className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-lg font-medium text-gray-800">
                {question.content}
              </span>
              <button
                className="text-red-400 hover:text-red-600 transition"
                onClick={() => deleteDailyQuestion(question.id)}
              >
                ✖
              </button>
            </motion.li>
          ))}
        </ul>
        <div className="flex mt-4 space-x-2">
          <input
            value={newDailyQuestion}
            onChange={(e) => setNewDailyQuestion(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddDailyQuestion)}
            className="flex-grow border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 shadow-sm"
            placeholder="새로운 질문 추가..."
          />
          <button
            onClick={handleAddDailyQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition shadow-md"
          >
            추가
          </button>
        </div>
      </motion.div>

      {/* Periodic Questions Section */}
      <motion.div
        className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">정기 질문</h2>
        <ul className="space-y-3">
          {periodicQuestions.map((question) => (
            <motion.li
              key={question.id}
              className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-4 h-4 rounded-full ${question.period === '매주' ? 'bg-green-400' : 'bg-yellow-400'}`}
                ></span>
                <span className="text-lg font-medium text-gray-800">
                  {question.content}
                </span>
              </div>
              <button
                className="text-red-400 hover:text-red-600 transition"
                onClick={() => deletePeriodicQuestion(question.id)}
              >
                ✖
              </button>
            </motion.li>
          ))}
        </ul>
        <div className="flex mt-4 space-x-2">
          <input
            value={newPeriodicQuestion}
            onChange={(e) => setNewPeriodicQuestion(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddPeriodicQuestion)}
            className="flex-grow border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 shadow-sm"
            placeholder="새로운 정기 질문 추가..."
          />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as Period)}
            className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm"
          >
            <option value="매주">매주</option>
            <option value="매월">매월</option>
          </select>
          <button
            onClick={handleAddPeriodicQuestion}
            className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition shadow-md"
          >
            추가
          </button>
        </div>
      </motion.div>
    </div>
  );
}
