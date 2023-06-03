import React, { useEffect, useState } from "react";
import * as MUI from "@mui/material";
import "./TaskFilter.css";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';


export const TaskFilter = ({tasks, setFilterResults, tasksGetter}) => {
  
  const [filterQuery, setFilterQuery] = useState({
    taskName: "",
    datemin: "2000-01-01",
    datemax: "2500-12-31",
    status: "",
    tag: ""
  });
 
  const filterProcess = () => {
    if (
      !filterQuery.taskName &&
      filterQuery.datemin === "2000-01-01" &&
      filterQuery.datemax === "2500-12-31" &&
      !filterQuery.tag &&
      !filterQuery.status
    ) {
      // No se ha seleccionado ningún filtro, no se muestran tareas
      setFilterResults([]);
      return;
    }
    const filteredTasks = tasks.filter((task) => {
      const nameMatch =
        task.taskName &&
        filterQuery.taskName &&
        task.taskName.toLowerCase().includes(filterQuery.taskName.toLowerCase());
      const dueDateMatch =
      task.dueDate &&
      (!filterQuery.datemin || task.dueDate >= filterQuery.datemin) &&
      (!filterQuery.datemax || task.dueDate <= filterQuery.datemax);
      const tagMatch =
        task.tag &&
        filterQuery.tag &&
        task.tag===filterQuery.tag;
      const statusMatch =
        task.status===filterQuery.status;

      return (
        (!filterQuery.taskName || nameMatch) &&
        (!filterQuery.datemin || !filterQuery.datemax || dueDateMatch) &&
        (!filterQuery.tag || tagMatch) &&
        (!filterQuery.status || statusMatch                                                                                                                               )
      );
    });
    setFilterResults(filteredTasks);
  };

  useEffect(() => {
    filterProcess();
  }, [filterQuery, tasks]);


  const handleFilterChange = (filterName, value) => {
    setFilterQuery((prevFilters) => ({
      ...prevFilters,
      [filterName]: value === "" ? null : value
    }));
    tasksGetter(); 
  };
  
  
   return (

    <div className="task-filter">
      <div className="field">
        <MUI.TextField
          label="Tarea"
          value={filterQuery.taskName || ""}
          onChange={(e) => handleFilterChange("taskName", e.target.value)}
          className="filter-field"
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
      <div className="field">
        <MUI.TextField
          label="Desde"
          type="date"
          onChange={(e) => handleFilterChange("datemin", e.target.value)}
          className="filter-field"
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
      <div className="field">
        <MUI.TextField
          label="Hasta"
          type="date"  
          onChange={(e) => handleFilterChange("datemax", e.target.value)}
          className="filter-field"
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
      <div className="field">
        <MUI.TextField
          label="Etiqueta"
          select
          value={filterQuery.tag || ""}
          onChange={(e) => handleFilterChange("tag", e.target.value)}
          className="filter-field"
          InputLabelProps={{
            shrink: true
          }}
        >
          <MUI.MenuItem value="Personal">Personal</MUI.MenuItem>
          <MUI.MenuItem value="Trabajo">Trabajo</MUI.MenuItem>
          <MUI.MenuItem value="Estudios">Estudios</MUI.MenuItem>
          <MUI.MenuItem value="Otros">Otros</MUI.MenuItem>
        </MUI.TextField>
      </div>
      <div className="field">
        <MUI.TextField
          label="Estado"
          select
          value={filterQuery.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="filter-field"
          InputLabelProps={{
            shrink: true
          }}
        >
           <MUI.MenuItem value="PENDING">Pendientes</MUI.MenuItem>
           <MUI.MenuItem value="POSTPONED">Pospuestas</MUI.MenuItem>
           <MUI.MenuItem value="COMPLETED">Completadas</MUI.MenuItem>
           <MUI.MenuItem value="DELETED">Eliminadas</MUI.MenuItem>
        </MUI.TextField>
      </div>
      <div>
        <FilterAltOffIcon onClick={()=>setFilterQuery({
          taskName: "",
          datemin: "2000-01-01",
          datemax: "2500-12-31",
          status: "",
          tag: ""
          })}>
        </FilterAltOffIcon>
      </div>
    </div>
  );
};