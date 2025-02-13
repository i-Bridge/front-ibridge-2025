// src/api/todo.ts
import apiClient from './index';

export const postTodos = () => apiClient.post('/start/signin');
export const createTodo = () => apiClient.post('/todos');
