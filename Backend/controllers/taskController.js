const Task = require('../models/task.model')

const getTasks = (req,res) => {
    if(req.params.taskId) {
        Task.findById(req.params.taskId)
            .then(taskDoc => {
                if (taskDoc === null) {
                    res.status(404).send({msg: "No se han encontrado tareas"})
                } else {
                    res.status(200).send(taskDocs)    
                }
            })
            .catch(error => {
                console.log(error);
                switch (error.name) {
                    case 'CastError':
                        res.status(400).send('Formato de id inválido')
                        break;
                    default:
                        res.status(400).send(error)
                }
            })
    } else {

        let filter = {}

        if (req.query.status) {
            filter.status = req.query.status
        }

        //TODO: Find by text search

        //TODO: Find by datemax is not working properly
        if (req.query.datemax) {
            filter.dueDate = { $lte: new Date(req.query.datemax) }
        }

        console.log(req.query.status,filter)
        Task.find(filter)
            .then(taskDocs => {
                if(taskDocs.length === 0) {
                    res.status(404).send({msg: "No se han encontrado tareas"})
                } else {
                    res.status(200).send(taskDocs)
                }
                
            })
            .catch(error => res.status(400).send(error))
    }

}

const addTask = (req,res) => {
    Task.create(
        {
            taskName: req.body.taskName,
            dueDate: req.body.dueDate,
            tag: req.body.tag,
            description: req.body.description
        }
    ).then(taskDoc => res.status(200).send(taskDoc))
    .catch(error=>{
        console.log(error.code)
        switch(error.code) {
            case 11000 :
                res.status(400).send({msg:"task exist"})
                break;
            default:
                res.status(400).send(error)
        }
    })
}

const deleteTask = (req,res) => {
    Task.findOneAndUpdate(
        {
            _id: req.params.taskId,
            status: { $ne: "DELETED" }
        }
        ,
        {
            status: "DELETED",
            deletedAt: new Date()
        }, 
        {
            timestamps: false
        }
        )
        .then(taskDoc=>{
            console.log(taskDoc)
            if (taskDoc === null) {
                res.status(404).send({msg: "No se ha encontrado la tarea"})
            } else {
                res.status(200).send({msg:"ok"})   
            }
        })
        .catch(error=>{
            switch (error.name) {
                case 'CastError':
                    res.status(400).send({msg: 'Formato de id inválido'})
                    break;
                default:
                    res.status(400).send(error)
            }
        })
}

const updateTask = (req,res) => {
    Task.findByIdAndUpdate(
        {_id: req.params.taskId},
        {
            $set: {
              taskName: req.body.taskName,
              dueDate: req.body.dueDate,
              description: req.body.description,
              status: req.body.status,
              tag: req.body.tag
            }
          },
          { new: true } // Esto asegurará que se devuelva la tarea actualizada en la respuesta
        )
        .then(taskDoc=>{
            if (taskDoc === null) {
                res.status(404).send({msg: "No se han encontrado la tarea"})
            } else {
                res.status(200).send(taskDoc)   
            }
        })
        .catch(error=>{
            switch (error.name) {
                case 'CastError':
                    res.status(400).send({msg: 'Formato de id inválido'})
                    break;
                default:
                    res.status(400).send(error)
            }
        })
}

const permanentDelete = (req, res) => {
    const taskId = req.params.taskId;
    Task.findByIdAndDelete(taskId)
      .then(() => {
        res.status(200).json({ message: "Tarea eliminada permanentemente." });
      })
      .catch((error) => {
        res.status(500).json({ error: "Error al eliminar la tarea." });
      });
  };
  
module.exports = {
    getTasks,
    addTask,
    deleteTask,
    updateTask,
    permanentDelete
}