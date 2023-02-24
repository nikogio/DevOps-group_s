var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

router.get('/', function(req, res, next) {

  const errorMessage = req.session.errorMessage;
  const username = req.session.username;
  const email = req.session.email;

  delete req.session.errorMessage;
  delete req.session.username;
  delete req.session.email;
  res.render('signup', {errorMessage: errorMessage, username: username, email: email});
});

module.exports = router;

//dummy hash function
function hash(password) {
  return password;
}


router.post('/', function(req, res, next) {

  // user name must be entered
  if (!req.body.username) {
    req.session.errorMessage = 'You have to enter a username';
    res.redirect('/api/signup');
    return;
  }

  // correct format of email
  if (!req.body.email || !req.body.email.includes('@')) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.errorMessage = 'You have to enter a valid email address';
    res.redirect('/api/signup');
    return;
  }


  // password must be entered
  if (!req.body.password) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.errorMessage = 'You have to enter a password';
    res.redirect('/api/signup');
    return;
  }

  // passwords must match
  if (req.body.password != req.body.password2) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.errorMessage = 'The two passwords do not match';
    res.redirect('/api/signup');
    return;
  }

  // the user name cannot be already taken
  database.all('SELECT * FROM user WHERE username = ?', req.body.username, (err, rows) => {
    
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() });
      
      return;
    }

    // if user does not exist
    if (rows.length != 0) {
      req.session.username = req.body.username;
      req.session.email = req.body.email;
      req.session.errorMessage = 'The username is already taken';
      res.redirect('/api/signup');
      return;
    }
    return;
  })


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