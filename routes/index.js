var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/loginfb', function(req, res, next) {
  res.render('login_fb');
});

router.get('/home', (req, res) => {
  res.render('home')
})

module.exports = router;
