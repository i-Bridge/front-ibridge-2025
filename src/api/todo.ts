// src/api/todo.ts
import apiClient from './index';

export const getTodos = () => apiClient.get('/todos');
export const createTodo = () => apiClient.post('/todos');
