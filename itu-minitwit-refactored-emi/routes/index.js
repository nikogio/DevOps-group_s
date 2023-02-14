var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
