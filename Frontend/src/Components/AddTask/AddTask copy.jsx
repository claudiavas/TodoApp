import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useState, useEffect } from "react";
import * as MUI from "@mui/material";
import './AddTask.css';

const schema = yup.object({
  taskName: yup.string().required(),
  dueDate: yup.date().optional(),
  tag: yup.string(),
  description: yup.string(),
});


export const AddTask = ({ onTaskAdded, editTaskId, UpdateTask, handleCancelEdit, taskToEdit }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [task, setTask] = useState({
    taskName: taskToEdit ? taskToEdit.taskName : "",
    dueDate: taskToEdit ? taskToEdit.dueDate : "",
    taskStatus: taskToEdit ? taskToEdit.taskStatus : "",
    tag: taskToEdit ? taskToEdit.tag : "",
  })
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (editTaskId) {
      const taskToEdit = tasks.find((task) => task.id === editTaskId);
      if (taskToEdit) {
        setValue("taskName", taskToEdit.taskName);
        setValue("dueDate", taskToEdit.dueDate);
        setValue("tag", taskToEdit.tag);
        setValue("description", taskToEdit.description);
      }
    }
  }, [editTaskId]);

  const addTask = async (newTask) => {
    try {
      await axios.post("http://localhost:5000/tasks", newTask);
      setSuccessMessage("La tarea ha sido creada correctamente.");
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.message);
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, updatedTask);
      setSuccessMessage("La tarea ha sido actualizada correctamente.");
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.message);
    }
  };

  const onSubmit = (data) => {
    if (editTaskId) {
      updateTask(editTaskId, data);
      handleCancelEdit();
    } else {
      addTask(data);
      reset();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [successMessage, errorMessage]);

  return (
    <MUI.Box className="form" sx={{ display: "flex", flexDirection: "column" }}>
      <MUI.Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          margin: "10px"
        }}
      >
        <MUI.Grid container spacing={1}>
          <MUI.Grid item xs={6}>
            <MUI.TextField sx={{ width: "100%", margin: "6px" }}
              label="Tarea"
              variant="outlined"
              {...register("taskName")}
              error={!!errors.taskName}
              helperText={errors.taskName?.message}
              InputLabelProps={{
                shrink: true
              }}
            />
          </MUI.Grid>
          <MUI.Grid item xs={6}>
            <MUI.TextField sx={{ width: "97%", margin: "6px" }}
              label="Descripción (opcional)"
              variant="outlined"
              multiline
              minRows={1}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              InputLabelProps={{
                shrink: true
              }}
            />
          </MUI.Grid>
        </MUI.Grid>
            
        <MUI.Grid container spacing={1}>
          
          <MUI.Grid item xs={6}>
            <MUI.TextField sx={{ width: "100%", margin: "6px" }}
              className="dateField"
              label="Vencimiento"
              type="date"
              variant="outlined"
              defaultValue=""
              inputProps={{ style: { textAlign: "left" } }}
              {...register("dueDate")}
              InputLabelProps={{
                shrink: true
              }}
            />
          </MUI.Grid>
          <MUI.Grid item xs={6}>
            <MUI.TextField sx={{ width: "97%", margin: "6px" }}
              label="Etiqueta (opcional)"
              variant="outlined"
              {...register("tag")}
              InputLabelProps={{
                shrink: true
              }}
            />
          </MUI.Grid>
        </MUI.Grid>
  
        
        <MUI.Button variant="contained" type="submit" sx={{ margin: "5px" }}>
          {editTaskId ? "Editar Valores" : "Agregar Tarea"}
        </MUI.Button>
        {successMessage && (
          <MUI.Alert severity="success">{successMessage}</MUI.Alert>
        )}
        {errorMessage && (
          <MUI.Alert severity="error">{errorMessage}</MUI.Alert>
        )}
        {editTaskId && (
          <MUI.Button variant="contained" sx={{ margin: "5px" }} onClick={handleCancelEdit}>
            Cancelar Edición
          </MUI.Button>
        )}
      </MUI.Box>
    </MUI.Box>
  );
}  