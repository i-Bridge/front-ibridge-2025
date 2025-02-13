import axiosInstance from '.';

export const postTodos = () => axiosInstance.post('/start/signin');
export const createTodo = () => axiosInstance.post('/todos');
