var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const messages = database.all("SELECT * FROM message", undefined, (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(rows);
   
    res.send("There are " + messages + " messages.")
    return rows;
  });
  
});


module.exports = router;
