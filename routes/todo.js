const express = require('express');
const router = express.Router();
const { 
  addTodo, 
  listTodo, 
  updateTodo, 
  deleteTodo 
} = require('../controllers/todo')

router
  .post('/add', addTodo)
  .get('/mytodolist', listTodo)
  .put('/mytodolist/:todolistId', updateTodo)
  .delete('/mytodolist/:todolistId', deleteTodo)

module.exports = router;
