import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import * as MUI from "@mui/material";
import { addTask } from "../../apiService/apiService";
import './AddTask.css';

const schema = yup.object({
  taskName: yup.string().required(),
  dueDate: yup.date().optional(),
  tag: yup.string(),
  description: yup.string(),
});

export const AddTask = ({tasksGetter}) => {
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  

  const onSubmit = (data) => {
     try {
        addTask(data);
        tasksGetter();
        setSuccessMessage("La tarea ha sido creada correctamente.");
        setErrorMessage("");
      } catch (error) {
        setSuccessMessage("");
        setErrorMessage(error.message);
      }
      reset();
      
    }

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
                select
                inputProps={{ style: { textAlign: "left" } }}
                {...register("tag")}
                defaultValue=""
                InputLabelProps={{
                  shrink: true
                }}
              >
                <MUI.MenuItem value="Personal">Personal</MUI.MenuItem>
                <MUI.MenuItem value="Trabajo">Trabajo</MUI.MenuItem>
                <MUI.MenuItem value="Estudios">Estudios</MUI.MenuItem>
                <MUI.MenuItem value="Otro">Otro</MUI.MenuItem>
                <MUI.MenuItem value="">Sin Etiqueta</MUI.MenuItem>
              </MUI.TextField>
            </MUI.Grid>
          </MUI.Grid>
          
        <MUI.Button variant="contained" type="submit" sx={{ margin: "5px" }}>
          Agregar Tarea
        </MUI.Button>
        {successMessage && (
          <MUI.Alert severity="success">{successMessage}</MUI.Alert>
        )}
        {errorMessage && (
          <MUI.Alert severity="error">{errorMessage}</MUI.Alert>
        )}
      </MUI.Box>
    </MUI.Box>
  );
}  