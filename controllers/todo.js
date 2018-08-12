const Todo = require('../models/todo')
const jwt = require('jsonwebtoken')

module.exports = {
  addTodo: (req, res) => {
    const { token } = req.headers
    const { title, due_date } = req.body
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    Todo
      .create({
        user: decoded.id,
        title: title,
        due_date: due_date
      })
      .then(todo => {
        res.status(200).json({
          message: "Create todo success",
          todo: todo
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
  },

  listTodo: (req, res) => {
    const { token } = req.headers
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    Todo
      .find({ user: decoded.id })
      .populate('user', 'fullname')
      .then(todoList => {
        res.status(200).json({
          message: "Todo List",
          todoList: todoList
        })
      })
      .catch(err => {
        res.status(500).json({
          errorListTodo: err
        })
      })
  },

  updateTodo: (req, res) => {
    const { title, due_date, status } = req.body
    const { todolistId } = req.params
    Todo
      .updateOne(
        { 
          _id: todolistId
        },
        {
          $set: {
            title: title,
            due_date: due_date,
            status: status
          }
        }
      )
      .then(result => {
        res.status(200).json({
          message: "Todo success update",
          result
        })
      })
      .catch(err => {
        res.status(500).json({
          errorUpdateTodo: err
        })
      })
  },

  deleteTodo: (req, res) => {
    const { todolistId } = req.params
    Todo
      .deleteOne({ _id: todolistId })
      .then(result => {
        res.status(200).json({
          message: "Todo success deleted",
          result
        })
      })
      .catch(err => {
        res.status(500).json({
          errorUpdateTodo: err
        })
      })
  }
}