const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000;
const tasksRouter = require('./routes/tasks')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/tasks', tasksRouter)

//app.get('/', (req, res) => {
//  console.log("hello")
//  res.status(200).send("Hello app")
//})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; 









