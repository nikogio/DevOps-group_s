var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('signin', { title: 'MiniTwit' });
});

router.post('/', function (req, res, next) {
  database.all("SELECT * FROM user WHERE username = ?", req.body.username, (err, rows) => {
    
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() });
      return;
    }

    console.log(rows);
  })
})

module.exports = router;