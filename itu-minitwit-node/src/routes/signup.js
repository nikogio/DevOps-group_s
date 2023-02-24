var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

router.get('/', function(req, res, next) {

  const errorMessage = req.session.errorMessage;

  delete req.session.errorMessage;
  res.render('signup', {errorMessage: errorMessage});
});

module.exports = router;

//dummy hash function
function hash(password) {
  return password;
}


router.post('/', function(req, res, next) {

  if (!req.body.username) {
    req.session.errorMessage = 'You have to enter a username';
    res.redirect('/api/signup');
    return;
  }
  //if request.body.password is not empty do this
  if (!req.body.password) {
    res.status(400).send('Password is required');
    return;
  }
  //if request.body.password and request.body.username has values from the form, do this
  var user = {
    username: req.body.username,
    password: hash(req.body.password)
  };
  //insert the user into the database
  db.insert(user, function(err, user) {
    if (err) {
      res.status(500).send('Error inserting new user: ' + err);
      return;
    }
    //if no error, redirect to the login page
    res.redirect('/login');
  });

 });