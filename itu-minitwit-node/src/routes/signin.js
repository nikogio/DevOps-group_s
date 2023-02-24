var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

router.get('/', function(req, res, next) {

  const errorMessage = req.session.errorMessage;

  delete req.session.errorMessage;
  res.render('signin', {errorMessage: errorMessage});
});


router.post('/', function (req, res, next) {

  database.all('SELECT * FROM user WHERE username = ?', req.body.username, (err, rows) => {
    
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() });
      
      return;
    }

    // if user does not exist
    if (rows.length == 0) {
      req.session.errorMessage = 'Incorrect username or password';
      res.redirect('/api/signin');
      return;
    }

    

    res.redirect('/api/');
  })
})

module.exports = router;