'use client';

import { useState, KeyboardEvent } from 'react';
import useQuestionStore from '@/store/regular/questionStore';
import { Period } from '@/types/Regular/question';

export default function RegularQuestionPage() {
  const {
    dailyQuestions,
    periodicQuestions,
    addDailyQuestion,
    addPeriodicQuestion,
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">정기 질문</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">매일 질문</h2>
        <ul className="list-disc pl-5 mb-4">
          {dailyQuestions.map((question) => (
            <li key={question.id} className="mb-2">
              {question.content}
            </li>
          ))}
        </ul>
        <div className="flex">
          <input
            type="text"
            value={newDailyQuestion}
            onChange={(e) => setNewDailyQuestion(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddDailyQuestion)}
            className="flex-grow border border-gray-300 rounded-l px-4 py-2"
            placeholder="새로운 매일 질문 추가"
          />
          <button
            onClick={handleAddDailyQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">주기 질문</h2>
        <ul className="list-disc pl-5 mb-4">
          {periodicQuestions.map((question) => (
            <li key={question.id} className="mb-2">
              {question.content} - {question.period}
            </li>
          ))}
        </ul>
        <div className="flex">
          <input
            type="text"
            value={newPeriodicQuestion}
            onChange={(e) => setNewPeriodicQuestion(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddPeriodicQuestion)}
            className="flex-grow border border-gray-300 rounded-l px-4 py-2"
            placeholder="새로운 주기 질문 추가"
          />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as Period)}
            className="border-t border-b border-gray-300 px-4 py-2"
          >
            <option value="매일">매일</option>
            <option value="매주">매주</option>
            <option value="매월">매월</option>
          </select>
          <button
            onClick={handleAddPeriodicQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
