const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const nodemailer = require('nodemailer')

module.exports = {
  signup: (req, res) => {
    User.create({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password
    })
      .then(resultSignup => {
        let transporter = nodemailer.createTransport({
          service: "GMAIL",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });

        let mailOptions = {
          from: '"Todo Fancy 📌" <no-replay@todofancy.com>',
          to: `${req.body.email}`,
          subject: "Register ✔",
          text: "Hello world?",
          html: `
            <img src="https://octodex.github.com/images/mountietocat.png"><br><br>
            <h2>Hi, ${req.body.fullname}</h2>
            <p>Thanks for register to Todo Fancy Apps. Glad you can become our member.</p>
            <br><br>
            <strong>
              Regards, <br>
              Ari Supriatna
            </strong>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Send email success");
        });
        const token = jwt.sign({
          id: resultSignup._id,
          fullname: resultSignup.fullname,
          email: resultSignup.email
        }, process.env.JWT_SECRET_KEY)
        res.status(200).json({
          message: "Register Success",
          token: token,
          resultSignup
        });
      })
      .catch(err => {
        res.status(401).json({
          error: err.message
        });
      });
  },

  signin: (req, res) => {
    User.findOne({ email: req.body.email })
      .then(dataUser => {
        if (dataUser) {
          bcrypt
            .compare(req.body.password, dataUser.password)
            .then(isPassword => {
              if (isPassword) {
                const token = jwt.sign(
                  {
                    id: dataUser._id,
                    fullname: dataUser.fullname,
                    email: dataUser.email
                  },
                  process.env.JWT_SECRET_KEY
                );
                return res.status(200).json({
                  msg: "Login success",
                  data: dataUser,
                  token: token
                });
              }
              return res.status(400).json({
                message: "Email or password failed"
              });
            })
            .catch(err => {
              res.status(500).json({
                errorComparePassword: err
              });
            });
        } else {
          res.status(500).json({
            msg: "The user has not registered"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          errorFindUser: err
        });
      });
  },

  signinFacebook: (req, res) => {
    const { accessToken, userID } = req.body;
    let urlFacebookGraph = `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`;

    axios
      .get(urlFacebookGraph)
      .then(dataUser => {
        User.findOne({ email: dataUser.data.email })
          .then(result => {
            if (result) {
              const token = jwt.sign(
                {
                  id: result._id,
                  fullname: result.fullname,
                  email: result.email
                },
                process.env.JWT_SECRET_KEY
              );

              res.status(200).json({
                message: "Login success",
                token: token
              });
            } else {
              User.create({
                fullname: dataUser.data.name,
                email: dataUser.data.email,
                password: process.env.PASSWORD_DEFAULT
              })
                .then(() => {
                  const token = jwt.sign(
                    {
                      id: userID,
                      email: dataUser.data.email
                    },
                    process.env.JWT_SECRET_KEY
                  );

                  res.status(201).json({
                    message: "Login success",
                    token: token
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    errorCreateUserFB: err
                  });
                });
            }
          })
          .catch(err => {
            res.status(500).json({
              errorFindUser: err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },

  getUsername: (req, res) => {
    const { token } = req.body
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const fullname = decoded.fullname

    if (fullname) {
      res.status(200).json({
        message: "Get username success",
        username: fullname
      })
    } else {
      res.status(500).json({
        errorGetUsername: 'Username not found'
      })
    }
  }
};
