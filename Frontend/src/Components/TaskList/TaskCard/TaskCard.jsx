import "./TaskCard.css"
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from "@mui/icons-material/Edit";
import SquareIcon from '@mui/icons-material/Square';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from "react";
import { updateTask } from "../../../apiService/apiService";
import { permanentDelete } from "../../../apiService/apiService";
import * as MUI from "@mui/material";


export const TaskCard = ({ _id, taskName, tag, dueDate, description, status, tasksGetter}) => {

  const [value, setValue] = useState({
    taskName: taskName,
    tag: tag,
    dueDate: dueDate,
    description: description,
    status: status
  });

  
  // CHECKBOX COMPLETAR O ELIMINAR TAREA
  
  const handleStatusChange = async (_id, status) => {
      updateTask(_id, { status: status });
      await setValue((prevState) => ({
        ...prevState,
        status: status,
      }));
      tasksGetter();
  }


  // MODO DE EDICIÓN

  const [editMode, setEditMode] = useState(false);

  const handleFieldChange = (fieldName, e) => {
    const newValue = e.target.value !== undefined ? e.target.value : ''; // Verificar si es undefined
    setValue((prevState) => ({
      ...prevState,
      [fieldName]: newValue,
    }));
  };

  const handlePermanentDelete = async (_id) => {
    await permanentDelete(_id);
    await tasksGetter();
  }

  const onUpdate = async () => {
    await updateTask(_id, value);
  };

  const editPopup = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      await onUpdate();
      await tasksGetter();
      setEditMode(false);
    }
    }
  
    return (
      
    <div>
     
      <div className="list">
      {status !== "DELETED" && (
      <input
        type="checkbox"
        checked={status === "COMPLETED"}
        onChange={() =>
          handleStatusChange(
            _id,
        status === "COMPLETED" ? "PENDING" : "COMPLETED"
      )
    }
    title={status === "COMPLETED" ? "Marcar como pendiente" : "Marcar como completado"}
  />
)}
{status === "DELETED" && (
  <SquareIcon />
)}
        <div className="card">
          <div className="firstlinecard">
            {!editMode ? 
              <h5 className={`field ${value.status === "DELETED" ? "deleted-task" : ""}`}>{taskName}</h5> : 
              <input value={value.taskName} onChange={(e) => handleFieldChange('taskName', e)}></input>}
            {!editMode ? 
              <h5>{tag}</h5> :
              <select value={value.tag} onChange={(e) => handleFieldChange('tag', e)}>
                <option value="Personal">Personal</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Estudios">Estudios</option>
                <option value="Otro">Otro</option>
                <option value="Sin Etiqueta">Sin Etiqueta</option>
              </select>}
            {!editMode ? 
              <h5>{dueDate}</h5> : 
              <MUI.TextField type="date" value={value.dueDate} onChange={(e) => handleFieldChange('dueDate', e)}/>}
          </div>
          <div className="secondlinecard">
            {!editMode ? 
              <h5 className={`field ${value.status === "DELETED" ? "deleted-task" : ""}`}>{description}</h5> : 
              <input value={value.description || 'Descripción...'} onChange={(e) => handleFieldChange('description', e)}></input>}
          </div>
        </div>
        <IconButton onClick={editPopup} aria-label="Editar" size="small">
          {status === "PENDING" || status === "POSTPONED" ? <EditIcon titleAccess="editar"/> : null}
        </IconButton>
        <IconButton onClick={() => handleStatusChange(_id, status === "PENDING" ? "POSTPONED" : "PENDING")} aria-label="Eliminar" size="small">
          {status === "PENDING" ? <MoreTimeIcon titleAccess="posponer"/> : status === "POSTPONED" ? <HistoryIcon titleAccess="regresar a tareas pendientes"/> : null}
        </IconButton>
        <IconButton onClick={() => handleStatusChange(_id, status === "DELETED" ? "PENDING" : "DELETED")} aria-label="Eliminar" size="small">
          {status === "DELETED" ? <RestoreFromTrashIcon titleAccess="restaurar"/> : status === "PENDING" || status === "POSTPONED" ? <DeleteIcon titleAccess="eliminar"/> : null}
        </IconButton>
        <IconButton onClick={() => handlePermanentDelete(_id)} aria-label="Eliminar permanentemente" size="small">
          {status === "DELETED" ? <DeleteForeverIcon titleAccess="eliminar permanentemente"/> : null}
        </IconButton>
      </div>
    </div>
    );
}