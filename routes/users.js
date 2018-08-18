const express = require('express');
const router = express.Router();
const { signup, signin, signinFacebook, getUsername } = require('../controllers/user')

router
  .post('/signup', signup)
  .post('/signin', signin)
  .post('/signin/facebook', signinFacebook)
  .post('/getUsername', getUsername)

module.exports = router;
