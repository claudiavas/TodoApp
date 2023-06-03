import './App.css'
import { TaskList } from './Components/TaskList/TaskList.jsx';
import { AddTask } from './Components/AddTask/AddTask.jsx';
import { Container } from '@mui/material';
import { useState } from 'react';
import { getAllTasks } from './apiService/apiService';

const App = () => {
  
  const [tasks, setTasks] = useState([]) // array que almacena lo que traemos del backend
  // TODO incorporar asincronía (async await) en esta función y volver a intentar con el trim de la fecha.
  const tasksGetter = () => {getAllTasks().then(setTasks)};


return (
    <Container>
      <div className="App">
        <h1>TODO LIST</h1>
        <AddTask tasksGetter={tasksGetter}/>
        <br></br>
        <TaskList tasksGetter={tasksGetter} tasks={tasks}/>
      </div>
    </Container>
    );
  }  



export default App
  
