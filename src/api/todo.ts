import axiosInstance from '.';


export const postTodos = () => axiosInstance.post('/start/signin');
export const createTodo = () => axiosInstance.post('/todos');

export const getMainInfo = () => axiosInstance.get('/parent/{childId}/home'); //url 수정 필요

