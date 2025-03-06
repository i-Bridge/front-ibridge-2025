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
    <div className="max-w-3xl mx-auto p-10 space-y-10">
      <h1 className="text-4xl font-bold  text-gray-800 tracking-wide">
        아이에게 궁금한 점을 물어보세요!
      </h1>

      {/* Daily Questions Section */}
      <motion.div
        className="p-6 border-b border-gray-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          매일 물어볼 질문
        </h2>
        <ul className="space-y-2">
          {dailyQuestions.map((question) => (
            <motion.li
              key={question.id}
              className="flex justify-between p-3 border-b border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-lg font-medium text-gray-800">
                {question.content}
              </span>
              <button
                className="text-red-500 hover:text-red-700 transition"
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
            className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="새로운 질문 추가..."
          />
          <button
            onClick={handleAddDailyQuestion}
            className="bg-i-skyblue text-white px-4 py-2 rounded-md hover:bg-i-darkblue transition"
          >
            추가
          </button>
        </div>
      </motion.div>

      {/* Periodic Questions Section */}
      <motion.div
        className="p-6 border-b border-gray-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          추이를 알고 싶은 질문
        </h2>
        <ul className="space-y-2">
          {periodicQuestions.map((question) => (
            <motion.li
              key={question.id}
              className="flex justify-between p-3 border-b border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex space-x-3">
                <span
                  className={`w-4 h-4 rounded-full ${question.period === '매주' ? 'bg-i-lightgreen' : 'bg-i-yellow'}`}
                ></span>
                <span className="text-lg font-medium text-gray-800">
                  {question.content}
                </span>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition"
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
            className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-400"
            placeholder="새로운 정기 질문 추가..."
          />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as Period)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="매주">매주</option>
            <option value="매월">매월</option>
          </select>
          <button
            onClick={handleAddPeriodicQuestion}
            className="bg-i-skyblue text-white px-4 py-2 rounded-md hover:bg-i-darkblue transition"
          >
            추가
          </button>
        </div>
      </motion.div>
    </div>
  );
}
