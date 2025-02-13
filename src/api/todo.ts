// src/api/todo.ts
import apiClient from './index';

export const postTodos = () => apiClient.post('/start/signin');
export const createTodo = () => apiClient.post('/todos');

export const getDayInfo = () => apiClient.get('/parent/{childId}/home'); //url 수정 필요
