import axios from "axios";


export const getAllTasks = async () => {
  const { data } = await axios.get("http://localhost:8000/tasks");
  return data;
}

export const updateTask = async (_id, body) => {
  const { data } = await axios.put(`http://localhost:8000/tasks/${_id}`, body);
  return data;
}


export const deleteTask = async (_id, body) => {
  const { data } = await axios.put(`http://localhost:8000/tasks/${_id}`, body);
  return data;
}

export const addTask = async (body) => {
  const { data } = await axios.post(`http://localhost:8000/tasks/`, body);
  return data;
}

export const permanentDelete = async (_id) => {
  const { data } = await axios.delete(`http://localhost:8000/tasks/${_id}`);
  return data;
}
