import './TaskList.css';
import React, { useState, useEffect } from "react";
import { TaskCard } from "./TaskCard/TaskCard";
import { TaskFilter } from './TaskFilter/TaskFilter';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const TaskList = ({tasksGetter, tasks}) => {
  
  const [filterResults, setFilterResults] = useState([]); // almacena las tareas filtradas en TaskFilter
  
  const pendingTasks = tasks.filter((task) => task.status === "PENDING");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
  const postponedTasks = tasks.filter((task) => task.status === "POSTPONED");
  const deletedTasks = tasks.filter((task) => task.status === "DELETED");

  useEffect(() => { 
    tasksGetter()
    }, [])

  return (
    <div>
      <div>
      <h1>FILTROS</h1>
      <br></br>
        <TaskFilter tasks={tasks} setFilterResults={setFilterResults} tasksGetter={(tasksGetter)}/>
      </div>

      <div>
        {filterResults.map((task) => (
          <TaskCard
            key={task._id}
            tasks={tasks}
            _id={task._id}
            taskName={task.taskName}
            tag={task.tag}
            dueDate={task.dueDate}
            description={task.description}
            status={task.status}
            tasksGetter={tasksGetter}
          />
        ))}
      </div>
      <div>
        
   <div>
      <br></br>
      <h1>LISTADO DE TAREAS</h1>
      {/* Tareas pendientes */}
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Tareas Pendientes ({pendingTasks.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {pendingTasks.map((task) => (
              <Grid item key={task._id}>
                <TaskCard
            key={task._id}
            tasks={tasks}
            _id={task._id}
            taskName={task.taskName}
            tag={task.tag}
            dueDate={task.dueDate}
            description={task.description}
            status={task.status}
            tasksGetter={tasksGetter}
          />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Tareas pospuestas */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Tareas Pospuestas ({postponedTasks.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {postponedTasks.map((task) => (
              <Grid item key={task._id}>
               <TaskCard
            key={task._id}
            tasks={tasks}
            _id={task._id}
            taskName={task.taskName}
            tag={task.tag}
            dueDate={task.dueDate}
            description={task.description}
            status={task.status}
            tasksGetter={tasksGetter}
          />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

{/* Tareas completadas */}
<Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Tareas Completadas ({completedTasks.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {completedTasks.map((task) => (
              <Grid item key={task._id}>
               <TaskCard
            key={task._id}
            tasks={tasks}
            _id={task._id}
            taskName={task.taskName}
            tag={task.tag}
            dueDate={task.dueDate}
            description={task.description}
            status={task.status}
            tasksGetter={tasksGetter}
          />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

 {/* Tareas eliminadas */}
 <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Tareas Eliminadas ({deletedTasks.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {deletedTasks.map((task) => (
              <Grid item key={task._id}>
                <TaskCard
            key={task._id}
            tasks={tasks}
            _id={task._id}
            taskName={task.taskName}
            tag={task.tag}
            dueDate={task.dueDate}
            description={task.description}
            status={task.status}
            tasksGetter={tasksGetter}
          />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

    </div>
      </div>

    </div>
  );
};
