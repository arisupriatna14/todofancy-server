const express = require('express');
const router = express.Router();
const { signup, signin, signinFacebook } = require('../controllers/user')

/* GET users listing. */
router
  .post('/signup', signup)
  .post('/signin', signin)
  .post('/signin/facebook', signinFacebook)

module.exports = router;
