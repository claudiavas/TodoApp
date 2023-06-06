const express = require('express');
const router = express.Router();

//router.use(express.json());
router.use(express.urlencoded({ extended: true }))


let tasks = [
    {
      id: 1,
      taskName: "Preparar Informe Económico",
      tag: "Trabajo",
      dueDate: "2023-04-20",
      description: "",
      taskStatus: "PENDIENTE",
      createdAt: "2023-04-15 18:30:00",
      modifiedAt: null,
      deletedAt: null,
    },
    {
      id: 2,
      taskName: "Elaborar Orden de Compra Laptops",
      tag: "Trabajo",
      dueDate: "2023-04-20",
      description: "",
      taskStatus: "PENDIENTE",
      createdAt: "2023-04-15 18:30:00",
      modifiedAt: null,
      deletedAt: null,
  },
  {
    id: 3,
    taskName: "Plantear proyecto final",
    tag: "Estudios",
    dueDate: "2023-04-20",
    description: "",
    taskStatus: "PENDIENTE",
    createdAt: "2023-04-15 18:30:00",
    modifiedAt: null,
    deletedAt: null,
},
{
  id: 4,
  taskName: "Repasar React",
  tag: "Estudios",
  dueDate: "2023-04-20",
  description: "",
  taskStatus: "PENDIENTE",
  createdAt: "2023-04-15 18:30:00",
  modifiedAt: null,
  deletedAt: null,
},
{
  id: 5,
  taskName: "Sacar cita con el dentista",
  tag: "Personal",
  dueDate: "2023-04-20",
  description: "",
  taskStatus: "PENDIENTE",
  createdAt: "2023-04-15 18:30:00",
  modifiedAt: null,
  deletedAt: null,
},
{
  id: 6,
  taskName: "Renovar seguro coche",
  tag: "Personal",
  dueDate: "2023-04-20",
  description: "",
  taskStatus: "PENDIENTE",
  createdAt: "2023-04-15 18:30:00",
  modifiedAt: null,
  deletedAt: null,
},
]



// GET /tasks/

router.get('/', function(req, res, next) {
  res.json(tasks);
})

 // GET /tasks/:id?

router.get('/:id', function(req, res, next) {
      const task = tasks.find(task => task.id === parseInt(req.params.id));
      if (task) {
        res.status(200).send([task]);
      } else {
        res.status(404).send({ text: "Task not found" });
      }
      });


// Get /tasks/?Parameters

router.get('/', function(req, res, next) {
  let datemin = new Date(1970-01-01)
  let datemax = new Date(2500-01-01)
  req.query.datemin && (datemin = new Date(req.query.datemin))
  req.query.datemax && (datemax = new Date(req.query.datemax))
  const matchedTasks = tasks.filter(task => {
    const taskDueDate = new Date(task.dueDate)
    return taskDueDate >= datemin && taskDueDate <= datemax
  })
  res.json(matchedTasks);
})

// POST /tasks/

router.post('/', function(req, res, next) {

    function generateId() {
      const nextId = tasks.reduce((acc, obj) => obj.id > acc ? obj.id : acc, tasks[0].id) + 1;
      return nextId
    }
  
    const newTask = {
      id: generateId(),
      taskName: req.body.taskName,
      tag: req.body.tag,
      dueDate: req.body.dueDate,
      description: req.body.description,
      taskStatus: "PENDIENTE",
      createdAt: new Date(),
      modifiedAt: null,
      deletedAt: null
    };

  tasks.push(newTask);

  res.status(201).json(newTask);
})
  
// PUT (o PATCH) /tasks/:id Y SOFT DELETE
  
  router.put('/:id', function(req, res) {
    const taskIndex = tasks.findIndex(task => task.id === Number(req.params.id));
    if (taskIndex !== -1) {
      if (req.body.taskStatus === "DELETED") {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          ...req.body,
          deletedAt: new Date()
        };
        res.json({text:"The task was deleted"});
      } else {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          ...req.body,
          modifiedAt: new Date()
        };
        res.json({text:"The task was modified"});
      }
    } else {
      res.status(404).send({ text: "Task not found" });
    }
  });
  
  // DELETE /tasks/:id

  router.delete('/:id', function(req, res, next) {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      res.status(200).send({ text: "Task has been permanently deleted" });
    } else {
      res.status(404).send({ text: "Task not found" });
    }
  });
    
module.exports = router