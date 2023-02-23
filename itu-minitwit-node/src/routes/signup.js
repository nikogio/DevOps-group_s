var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('signup');
});

module.exports = router;

//dummy hash function
function hash(password) {
  return password;
}
router.post('/', function(req, res, next) {
  //if request.body.username is not empty do this

  if (!req.body.username) {
    res.status(400).send('Username is required');
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
  }

 });