'use client';

import { useState } from 'react';

export default function ChangeInfoPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [birthday, setBirthday] = useState('2000-01-01');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleApply = () => {
    setIsEditing(false);
    // Logic to apply changes (e.g., send a request to update the user information)
    alert('Changes applied!');
  };

  return (
    <div >
        <h1 className="text-2xl font-bold text-center mb-6">Change Personal Information</h1>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          {isEditing ? (
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your name"
            />
          ) : (
            <p>{name}</p>
          )}
        </div>

        {/* Birthday Field */}
        <div className="mb-6">
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
          {isEditing ? (
            <input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          ) : (
            <p>{birthday}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleEdit}
            className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600"
          >
            Edit
          </button>
          {isEditing && (
            <button
              onClick={handleApply}
              className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    
  );
}
