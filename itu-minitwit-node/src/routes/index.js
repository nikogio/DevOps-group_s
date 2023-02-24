var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

/**
 * GET /
 *
 * Checks whether the user is logged in.
 * If not logged in, retrieves most recent messages from the database and returns them (public timeline).
 * If logged in, retrieves most recent messages (follower and own) from the database and returns them.
 * 
 * Errors:
 *  - 500: An error occurred while retrieving the message
 */


// TODO: Switch to "personal" timeline if logged in. Currently only shows public timeline. 
router.get('/', function(req, res, next) {

  if (!req.session.user) {
    res.redirect('/api/public');
  }
  
  const flash = req.session.flash;
  delete req.session.flash;

  database.all("select message.*, user.* from message, user \
                where message.flagged = 0 \
                and message.author_id = user.user_id \
                and (user.user_id = ? or user.user_id in (select whom_id from follower where who_id = ?)) \
                order by message.pub_date desc limit 30"
    , [req.session.user, req.session.user], (err, rows) => {

    if (err) {
      console.error(err);
      res.status(500).render('error');
      return;
    }
    
    console.log('Successfully retrieved ' + rows.length + ' messages');
    console.log(rows);
    res.render('index', { messages: rows, flash: flash, path: req.path});
    });
  
    
});

/* Displays the latest messages of all users. */
router.get('/public', function (req, res, next) {
  
  database.all("select message.*, user.* from message, user \
                where message.flagged = 0 \
                and message.author_id = user.user_id \
                order by message.pub_date desc limit 30"
    , [], (err, rows) => {

    if (err) {
      console.error(err);
      res.status(500).render('error');
      return;
    }
    
    console.log('Successfully retrieved ' + rows.length + ' messages');
    res.render('index', { messages: rows, path: req.path});
    });
});

module.exports = router;