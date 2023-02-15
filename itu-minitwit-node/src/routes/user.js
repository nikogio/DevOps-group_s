var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

router.get('/', async function(req, res, next) {

    // Display's a users tweets.

    console.log("here");

    database.all("SELECT * FROM user where username = ?", [req.params.user], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() });
        return;
      }
  
      console.log('Successfully retrieved ' + rows.length + ' user');
      res.send({ user: rows });
    });
    
  });
  
  
  module.exports = router;