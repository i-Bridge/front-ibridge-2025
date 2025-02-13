'use client';
import { useState } from 'react';
import { PostTodos } from '@/api/todo';

export default function TestPostTodos() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('Attempting to sign in...');

    try {
      const result = await PostTodos();
      setResponse(result.data);
      console.log('SignIn successful. Response:', result.data);
      console.log('Full response object:', result);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      console.error('Error during SignIn:', err);
      console.log('Full error object:', err);
      if (err.response) {
        console.log('Error response data:', err.response.data);
        console.log('Error response status:', err.response.status);
        console.log('Error response headers:', err.response.headers);
      }
    } finally {
      setIsLoading(false);
      console.log('Sign in attempt completed.');
    }
  };

  return (
    <div>
      <h1>Test SignIn</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
