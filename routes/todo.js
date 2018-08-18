const express = require('express');
const router = express.Router();
const { 
  addTodo, 
  listTodo, 
  updateTodo, 
  deleteTodo,
  dataTodoUpdate,
  listEvent 
} = require('../controllers/todo')

router
  .post('/add', addTodo)
  .get('/mytodolist', listTodo)
  .get('/mytodolist/:todolistId', dataTodoUpdate)
  .put('/mytodolist/:todolistId', updateTodo)
  .delete('/mytodolist/:todolistId', deleteTodo)
  .get('/events', listEvent)
module.exports = router;
