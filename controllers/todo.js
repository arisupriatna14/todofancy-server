const Todo = require("../models/todo");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const nodemailer = require("nodemailer");
const HolidayAPI = require("node-holidayapi");
const hapi = new HolidayAPI(process.env.API_KEY_HOLIDAY);
const axios = require('axios')

module.exports = {
  addTodo: (req, res) => {
    const { token } = req.headers;
    const { title, due_date, sendEmail } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    Todo.create({
      user: decoded.id,
      title: title,
      due_date: due_date
    })
      .then(todo => {
        if (sendEmail) {
          nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
              service: "GMAIL",
              auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
              }
            });

            let date_created_convert = "";
            let yearCreated = new Date(todo.createdAt).getFullYear();
            let monthCreated = new Date(todo.createdAt).getMonth() + 1;
            let dateCreated = new Date(todo.createdAt).getDate();

            if (monthCreated < 10) {
              date_created_convert = `${yearCreated}0${monthCreated}${dateCreated}`;
            } else if (monthCreated >= 10) {
              date_created_convert = `${yearCreated}${monthCreated}${dateCreated}`;
            }

            let due_date_convert = "";
            let year = new Date(todo.due_date).getFullYear();
            let month = new Date(todo.due_date).getMonth() + 1;
            let date = new Date(todo.due_date).getDate();

            if (month < 10) {
              due_date_convert = `${year}0${month}${date}`;
            } else if (month >= 10) {
              due_date_convert = `${year}${month}${date}`;
            }

            let location = "Jakarta Selatan";
            let taskSplit = todo.title.split(" ").join("%20");
            let locationSplit = location.split(" ").join("%20");

            let mailOptions = {
              from: '"Todo Fancy 📌" <no-replay@todofancy.com>',
              to: `${decoded.email}`,
              subject: "Todolist ✔",
              text: "Hello world?",
              html: `
                <center>
                  <img src="https://octodex.github.com/images/mountietocat.png" width="50%"><br><br>
                  <h2>Todo Fancy List: </h2><br>
                  <strong>Task :</strong><br>
                  <strong>${todo.title}</strong><br>
                  <strong>Date :</strong><br>
                  <strong>${moment().format("LL")}</strong><br><br>
                  <table cellspacing="0" cellpadding="0"> 
                    <tr> 
                      <td align="center" width="300" height="40" bgcolor="#d62828" style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;">
                        <a href="http://www.google.com/calendar/event?action=TEMPLATE&dates=${date_created_convert}%2F${due_date_convert}&text=${taskSplit}&location=${locationSplit}" style="font-size:16px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
                        <span style="color: #ffffff;">
                          Save Remainder
                        </span>
                        </a>
                      </td> 
                    </tr> 
                  </table>
                </center>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Send email success");
            });
          });

          res.status(200).json({
            message: "Create todo success",
            todo: todo
          });
        } else {
          res.status(200).json({
            message: "Create todo success",
            todo: todo
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },

  listTodo: (req, res) => {
    const { token } = req.headers;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    Todo.find({ user: decoded.id })
      .populate("user", "fullname")
      .then(todoList => {
        res.status(200).json({
          message: "Todo List",
          todoList: todoList
        });
      })
      .catch(err => {
        res.status(500).json({
          errorListTodo: err
        });
      });
  },

  updateTodo: (req, res) => {
    const { title, due_date, status } = req.body;
    const { todolistId } = req.params;
    Todo.updateOne(
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
        });
      })
      .catch(err => {
        res.status(500).json({
          errorUpdateTodo: err
        });
      });
  },

  deleteTodo: (req, res) => {
    const { todolistId } = req.params;
    Todo.deleteOne({ _id: todolistId })
      .then(result => {
        res.status(200).json({
          message: "Todo success deleted",
          result
        });
      })
      .catch(err => {
        res.status(500).json({
          errorUpdateTodo: err
        });
      });
  },

  listEvent: (req, res) => {
    axios
      .get(
        `https://www.eventbriteapi.com/v3/events/search?q=Jakarta?&token=${process.env.EVENT_API_KEY}`
      )
      .then(result => {
        res
          .status(200)
          .json({ msg: `get all paginated events`, data: result.data });
      })
      .catch(err => {
        res.status(500).json({ msg: "err", error: err });
      });
  }
};
