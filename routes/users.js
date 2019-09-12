var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/signup', function(req, res, next) {
  res.send({'success' : true});
});

module.exports = router;
