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

  const getPeriodColor = (period: Period) => {
    switch (period) {
      case '매주':
        return 'bg-green-500'; // 초록색
      case '매월':
        return 'bg-yellow-500'; // 노란색
      default:
        return 'bg-gray-500'; // 기본 회색
    }
  };

  return (

    <div className="container bg-white mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">정기 질문</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">오늘의 기본 질문</h2>
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
        <h2 className="text-2xl font-semibold mb-4">
          정기적으로 계속하고 싶은 질문/추이를 알고 싶은 질문
        </h2>
        <ul className="list-none pl-0 mb-4">
          {periodicQuestions.map((question) => (
            <li key={question.id} className="mb-2 flex items-center">
              {/* 주기에 따른 색상 표시 */}
              <span
                className={`w-3 h-3 rounded-full mr-3 ${getPeriodColor(
                  question.period,
                )}`}
              ></span>
              {question.content}
              <span className="ml-auto text-sm text-gray-500">
                ({question.period})
              </span>
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
