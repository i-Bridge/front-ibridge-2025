'use client';
import { useEffect, useState } from 'react';
import { getTodos } from '@/api/todo';

export default function TestTodoFetch() {
  const [todos, setTodos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getTodos();
        setTodos(response.data);
        console.log('Fetched todos:', response.data);
      } catch (err) {
        console.error('Error fetching todos:', err);
      }
    };

    fetchTodos();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!todos) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Todos</h1>
      <pre>{JSON.stringify(todos, null, 2)}</pre>
    </div>
  );
}
