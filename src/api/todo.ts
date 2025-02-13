// src/api/todo.ts
import apiClient from './index';

export const PostTodos = () => apiClient.post('/start/signin');
export const createTodo = () => apiClient.post('/todos');
