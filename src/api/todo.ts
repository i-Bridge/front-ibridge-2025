// src/api/todo.ts
import apiClient from './index';

export const getTodos = () => apiClient.get('/start/{accountId}/login');
export const createTodo = () => apiClient.post('/todos');
