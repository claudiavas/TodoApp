var express = require('express')
var router = express.Router()

taskController = require('../controllers/taskController')

router.get('/:taskId?', taskController.getTasks)
router.post('/', taskController.addTask)
router.delete('/:taskId', taskController.permanentDelete)
router.put('/:taskId', taskController.updateTask)


module.exports = router