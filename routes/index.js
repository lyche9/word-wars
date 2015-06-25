var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/war', function(req, res, next) {
	res.render('war', {});
})

module.exports = router;
